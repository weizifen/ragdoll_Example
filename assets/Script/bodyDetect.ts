import { _decorator, Component, Node, RigidBody, geometry, PhysicsSystem, PhysicsRayResult, v3 } from 'cc';
import { CMovement } from './c_Movement';
import { VectorUtil } from './extend/vectorUtil';
import { StayStanding } from './stayStanding';
import { XPunchForce } from './x_PunchForce';
const { ccclass, property } = _decorator;
enum BodyState {
    Ground,
    Air,
}
@ccclass('BodyDetect')
export class BodyDetect extends Component {
    public mheadDistanceToGround: number; // 头部和地面的距离

    @property({type: RigidBody})
    private mhead: RigidBody = null;

    private m_Groundtime: number = 1.5;   // 弹跳间隔
    private m_Groundtimer: number;
    private m_Airtimer;
    private m_GravityFactor: number = 1.5;
    private mCanJumpWallRebound: boolean = false; // 判断是否可以在爬墙的时候反弹
    private mbodystate: BodyState; // 身体所处得状态（地面/空中）

    private m_StayStanding: StayStanding;
    private m_Cmovement: CMovement;

    private mhip: RigidBody;
    private m_coll: XPunchForce[] = [];
    private mhit: PhysicsRayResult;

    protected start() {
        // Your initialization goes here.
        this.m_StayStanding = this.node.getComponent(StayStanding);
        this.m_Cmovement = this.node.getComponent(CMovement);
        this.m_coll = this.node.getComponentsInChildren(XPunchForce);
    }

    protected update(deltaTime: number) {
        // Your update function goes here.
        this.HeadRayCast();

        // this.IsBodyGround(deltaTime);
        // if (!IsBodyGround() && m_Groundtimer < m_Groundtime || (m_Cmovement.m_state == State.up
        //     || m_Cmovement.m_state == State.rightUp || m_Cmovement.m_state == State.leftUp || m_Cmovement.m_IsInWater)) {
        //     return;
        // }
        if (this.mheadDistanceToGround < 0.4) {
            this.m_StayStanding.StandBalance();

        }
    }
    // 头部检测与地面的距离
    private HeadRayCast() {
        const startWorld = this.mhead.node.getWorldPosition();
        const ray = new geometry.ray(startWorld.x, startWorld.y, startWorld.z, VectorUtil.Vector3.down.x, VectorUtil.Vector3.down.y, VectorUtil.Vector3.down.z);
        const py = PhysicsSystem.instance;
        py.raycastClosest(ray, 1 << 0, 20, false);
        const mhit = py.raycastClosestResult;

        if (mhit) {
            this.mheadDistanceToGround = this.mhead.node.getWorldPosition().y - mhit.hitPoint.y;
            // console.log(`头部距离地面的高度：${this.mheadDistanceToGround}`);
        }
    }

}
