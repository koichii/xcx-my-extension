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
        this.roomname = "room0731@j-code.org"; // Room決定
        // socket接続したらroomに接続
        this.wsock.addEventListener('open', e => {
            console.log('wsock-open');
            // room に接続
            this.wsock.send(JSON.stringify({
                MSGTYPE: "JOIN",
                room: this.roomname,
            }));
            // 最初のメッセージを送信
            this.wsock.send(JSON.stringify({
                MSGTYPE: "MESSAGE",
                message: "こんにちは！",
            }));
        })
        // socket切断したら終わり
        this.wsock.addEventListener('close', e => {
            console.log("wsock-close!!")
        })
        // サーバからのデータ受信時に呼ばれる
        this.wsock.addEventListener('message', e => {
            console.log("wsock-message:", e.data)
            var msg = {};
            try {
                msg = JSON.parse(e.data)
            } catch (error) {
                console.log(error);
                return;
            }
            if (msg && msg.MSGTYPE=="MESSAGE") {
                this.receiveData.push(msg.message);
            }
        })
        this.receiveData = [];
        this.currentMessage = "";
        this.read = false;
    }

    /**
     * Read current message.
     * @return {Message} - string
     */
    readMessage () {
        return this.currentMessage;
    }

    /**
     * When data Recived.
     * @return {true} - data exist.
     */
    whenRecived (args) {
        if (this.read) {
            this.read = false;
            return false;
        }
        if (!this.receiveData.length) {
            return false;
        }
        this.read = true;
        this.currentMessage = this.receiveData.shift();
        console.log("whenRecived", this.currentMessage);
        return true;
    }
    /**
     * Recive next message
     */
    reciveNext (args) {
        this.currentMessage = "";
    }
   
    /**
     * Send Message.
     * @param {TEXT} args - the message to be sent.
     */
    sendMessage (args) {
        const text = Cast.toString(args.TEXT);
        console.log(text);
        this.wsock.send(JSON.stringify({
            MSGTYPE: "MESSAGE",
            message: text,
        }));
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
                    opcode: 'readMessage',
                    text: 'message',
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: "whenRecived",
                    blockType: BlockType.HAT,
                    text: "when Recived",
                    isEdgeActivated: true
/*
                    text: "when [CONDITION]",
                    arguments: {
                        CONDITION: {
                            type: ArgumentType.BOOLEAN,
                            defaultValue: false
                        }
                    },
*/
                },
                {
                    opcode: 'reciveNext',
                    blockType: BlockType.COMMAND,
                    text: 'Recive next message',
                },
                {
                    opcode: 'sendMessage',
                    blockType: BlockType.COMMAND,
                    text: 'send [TEXT]',
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
