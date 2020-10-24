import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Target')
export class Target extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property
    public tag: string = "";
    protected start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
