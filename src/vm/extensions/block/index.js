import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './block-icon.png';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.defaultMessage;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
        Object.assign(
            localeSetup.translations[localeSetup.locale],
            translations[localeSetup.locale]
        );
    }
};

const EXTENSION_ID = 'myExtension';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://githubAccount.github.io/xcx-my-extension/dist/myExtension.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'myExtension.name',
            default: 'My Extension',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for My Extension.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        if (runtime.formatMessage) {
            // Replace 'formatMessage' to a formatter which is used in the runtime.
            formatMessage = runtime.formatMessage;
        }

        this.wsock = new WebSocket("wss://j-code.org/ws/");
        console.log("wsock:", this.wsock);
        this.roomname = "4710@j-code.org"; // Room決定
        // socket接続したらroomに接続
        this.wsock.addEventListener('open', e => {
            console.log('wsock-open');
            // room に接続
            this.wsock.send(JSON.stringify({
                MSGTYPE: "JOIN",
                room: this.roomname,
            }));
            // 部屋にサーバーがいるか確認
            this.wsock.send(JSON.stringify({
                MSGTYPE: "MESSAGE",
                type: "server?",
                name: "myname",
            }));
/*
            this.serverid = null;
            setTimeout(()=>{
                console.log('wsock-timeout');
                if (!this.serverid) { // サーバーにつながらなかったら、接続をクローズ
                    this.wsock.close();
                    console.log('wsock-timeout-close');
                }
            }, 1000);
*/
        })
        // socket切断したら終わり
        this.wsock.addEventListener('close', e => {
            console.log("wsock-close!!")
        })
        // サーバからのデータ受信時に呼ばれる
        this.wsock.addEventListener('message', e => {
            console.log("wsock-message:", e.data)
        })

    }

    /**
     * Write log.
     * @param {object} args - the block arguments.
     * @property {number} TEXT - the text.
     */
     sendMessage (args) {
        const text = Cast.toString(args.TEXT);
        console.log(text);
    }

    doIt (args) {
        const func = new Function(`return (${Cast.toString(args.SCRIPT)})`);
        const result = func.call(this);
        console.log(result);
        return result;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: ExtensionBlocks.EXTENSION_ID,
            name: ExtensionBlocks.EXTENSION_NAME,
            extensionURL: ExtensionBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'sendMessage',
                    blockType: BlockType.COMMAND,
                    text: 'log [TEXT]',
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "hello"
                        }
                    }
                },
                {
                    opcode: 'do-it',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.doIt',
                        default: 'do it [SCRIPT]',
                        description: 'execute javascript for example'
                    }),
                    func: 'doIt',
                    arguments: {
                        SCRIPT: {
                            type: ArgumentType.STRING,
                            defaultValue: '3 + 4'
                        }
                    }
                }
            ],
            menus: {
            }
        };
    }
}

export {
    ExtensionBlocks as default,
    ExtensionBlocks as blockClass
};
