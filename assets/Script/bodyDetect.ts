import { _decorator, Component, Node, RigidBody, geometry, PhysicsSystem, PhysicsRayResult } from 'cc';
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

        // if (!IsBodyGround() && m_Groundtimer < m_Groundtime || (m_Cmovement.m_state == State.up
        //     || m_Cmovement.m_state == State.rightUp || m_Cmovement.m_state == State.leftUp || m_Cmovement.m_IsInWater)) {
        //     return;
        // }
        this.m_StayStanding.StandBalance();
    }
    // 头部检测与地面的距离
    private HeadRayCast() {
        const startWorld = this.mhead.node.getWorldPosition();
        const ray = new geometry.ray(startWorld.x, startWorld.y, startWorld.z, VectorUtil.Vector3.down.x, VectorUtil.Vector3.down.y, VectorUtil.Vector3.down.z);
        const py = PhysicsSystem.instance;
        py.raycastClosest(ray, 1 << 1, 20, false);
        const mhit = py.raycastClosestResult;

        if (mhit) {
            this.mheadDistanceToGround = this.mhead.node.getWorldPosition().y - mhit.hitPoint.y;
        }
    }

    // private IsBodyGround() {
    //     for (let i = 0; i < this.m_coll.length; i++) {
    //         const item = this.m_coll[i];
    //         if (item.IsCollisionGround)
    //         {
    //             if (item.GetComponent<LeftKnee>() != null || item.GetComponent<RightKnee>() != null || item.GetComponent<Hip>() != null
    //                 || item.GetComponent<LeftLeg>() != null || item.GetComponent<RightLeg>() != null)
    //             {
    //                 // 播放跑步特效
    //                 if ((item.GetComponent<LeftKnee>() != null || item.GetComponent<RightKnee>() != null)
    //                     && (m_Cmovement.m_state == State.forward || m_Cmovement.m_state == State.back))
    //                 {
    //                     PlayGroundEffect(item.groundPoint);
    //                 }
    //                 m_StayStanding.m_gravityFactor = 0;
    //                 mheadDistanceToGround = mhead.transform.position.y - item.groundPoint.y;
    //                 mCanJumpWallRebound = false;
    //                 return true;
    //             }
    //             continue;
    //         }
    //     }
    //     m_StayStanding.m_gravityFactor += m_GravityFactor * Time.fixedDeltaTime;
    //     if (m_StayStanding.m_gravityFactor>=2)
    //     {
    //         m_StayStanding.m_gravityFactor = 2;
    //     }
    //     StartCoroutine(ExternalGravity());
    //     mCanJumpWallRebound = true;
    //     return false;
    // }

}
