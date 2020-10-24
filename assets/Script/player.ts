import { _decorator, Component, Node } from 'cc';
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
    protected start () {
        // Your initialization goes here.
    }

    update (deltaTime: number) {
        // Your update function goes here.
        const world = this.node.getChildByName("head").getWorldPosition();
        console.log(world);
        
    }
}
