import { _decorator, Component, Node, RigidBody } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JointAnimationMgr')
export class JointAnimationMgr extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    public m_rigids: RigidBody[] = [];
    public m_head: RigidBody = null;

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
