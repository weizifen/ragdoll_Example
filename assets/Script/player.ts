import { _decorator, Component, Node, RigidBody, v3 } from 'cc';
import { BodyDetect } from './bodyDetect';
import { CMovement } from './c_Movement';
import { JointAnimationMgr } from './jointAnimationMgr';
import { StayStanding } from './stayStanding';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    // @property({type: JointAnimationMgr})
    // public m_JointAnimationMgr: JointAnimationMgr = null;

    // @property({type: BodyDetect})
    // public m_BodyDetect: BodyDetect = null;

    // @property({type: StayStanding})
    // public m_StayStanding: StayStanding = null;

    // @property({type: CMovement})
    // public m_Movement: CMovement = null;

    public m_JointAnimationMgr: JointAnimationMgr;
    public m_BodyDetect: BodyDetect;
    protected start () {
        // Your initialization goes here.
        this.m_JointAnimationMgr = this.node.getComponent(JointAnimationMgr);
        this.m_BodyDetect = this.node.getComponent(BodyDetect);
    }

    update (deltaTime: number) {
        // Your update function goes here.
        // const world = this.node.getChildByName("head").getWorldPosition();
        // console.log(world);
    }
}
