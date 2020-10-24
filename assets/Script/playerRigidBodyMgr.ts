import { _decorator, Component, Node, RigidBody, PhysicsSystem } from 'cc';
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
    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    private InitRigidBodies() { //初始化刚体，编号
        this.m_AllRigidBodies = this.node.getComponentsInChildren(RigidBody);
        const length = this.m_AllRigidBodies.length;
        for (let i = 0; i < length; i++) {
            const rigidbody = this.m_AllRigidBodies[i];
            // rigidbody.gameObject.AddComponent<RigidBodyIndexHolder>().InitIndex(i);   
        }
    }   
}
