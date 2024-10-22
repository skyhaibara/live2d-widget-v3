import showMessage from "./message.js";
import randomSelection from "./utils.js";

class Model {
    constructor(config) {
        let { cdnPath, switchType } = config;
        this.cdnPath = cdnPath;
        this.isRandomSwitch = switchType === 'order'
    }

    async loadModelList() {
        const response = await fetch(`${this.cdnPath}model_list.json`);
        this.modelList = await response.json();
    }

    async loadModel(modelId, modelTexturesId, message) {
        localStorage.setItem("modelId", modelId);
        localStorage.setItem("modelTexturesId", modelTexturesId);
        showMessage(message, 4000, 10);
        if (!this.modelList) await this.loadModelList();

        const target = randomSelection(this.modelList.models[modelId]);
        loadlive2d("live2d", `${this.cdnPath}model/${target}/index.json`);
    }

    /**
     * 切换皮肤（同一组模型）
     * @returns {Promise<void>}
     */
    async switchTextures() {
        const modelId = localStorage.getItem("modelId"),
            modelTexturesId = localStorage.getItem("modelTexturesId");
        if (!this.modelList) await this.loadModelList();
        const target = randomSelection(this.modelList.models[modelId]);
        loadlive2d("live2d", `${this.cdnPath}model/${target}/index.json`);
        showMessage("我的新衣服好看嘛？", 4000, 10);
    }

    /**
     * 切换模型
     * @returns {Promise<void>}
     */
    async switchModel() {
        let modelId = localStorage.getItem("modelId");
        if (!this.modelList) await this.loadModelList();
        const index = (++modelId >= this.modelList.models.length) ? 0 : modelId;
        this.loadModel(index, 0, this.modelList.messages[index]);
    }
}

export default Model;
