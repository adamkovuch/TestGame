import { injectable, inject } from "inversify";
import { RepositoryData } from "../core/repository/repository.data";
import { Setting } from "../models/setting";
import { getid } from "../extensions/getid";


@injectable()
export class SettingService {
    private readonly settingData: any[] = [];

    constructor(@inject(RepositoryData.of(Setting)) private repository: RepositoryData<Setting>) {
    }

    async load() {
        this.settingData.splice(0);  //clear

        (await this.repository.Get()).forEach(elem=>{
            this.settingData[elem.key] = elem.value;
        });
    }

    get(key: string) {
        return this.settingData[key];
    }

    set(key: string, value: any) {
        this.settingData[key] = value;

        (async () => {
            const settings = await this.repository.Get(e=>e.find({key: key}));
            if(settings.length > 0) {
                const setting = settings[0];
                setting.value = value;
                this.repository.Update(getid(setting), setting);
            } else {
                const setting = new Setting();
                setting.key = key;
                setting.value = value;
                this.repository.Add(setting);
            }
        })();
    }
}