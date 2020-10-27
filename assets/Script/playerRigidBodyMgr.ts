import { _decorator, Component, Node, RigidBody, PhysicsSystem, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerRigidBodyMgr')
export class PlayerRigidBodyMgr extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    public m_AllRigidBodies: RigidBody[];
    public m_HipRigidBody: RigidBody;

    protected onLoad() {

    }
    start() {
        // Your initialization goes here.
        this.m_HipRigidBody = this.node.getChildByName("hip").getComponent(RigidBody);
        this.InitRigidBodies();
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    private InitRigidBodies() { //初始化刚体，编号
        this.m_AllRigidBodies = this.node.getComponentsInChildren(RigidBody);
    }
}
