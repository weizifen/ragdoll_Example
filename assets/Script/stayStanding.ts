import { _decorator, Component, Node, RigidBody, ConstantForce, geometry, PhysicsSystem } from 'cc';
import { BodyDetect } from './bodyDetect';
import { VectorUtil } from './extend/vectorUtil';
import { JointAnimationMgr } from './jointAnimationMgr';
import { Player } from './player';
const { ccclass, property } = _decorator;

// 控制人物站立类
@ccclass('StayStanding')
export class StayStanding extends Component {

    public m_UpMuliForceFadeSpeed: number = 500; // 额外上拉力的衰减速度
    public m_StandUpForce: number; // 人物平衡时候给头部向上的力
    public m_StandUpMultiForce: number; // 物体在stand平衡之前为了达到平衡给头部的额外的上拉力
    public m_gravityFactor: number = 0; // 模拟额外重力的因子
    public m_gravityForceMultiplayer: number = 4000;
    public m_headBalanceHeight: number = 1.9; // 头部在平衡状态下到地面的距离

    @property(RigidBody)
    private m_head: RigidBody = null;
    private m_jointAnimationMgr: JointAnimationMgr;
    private m_rigids: RigidBody[] = [];
    private m_bodyDetect: BodyDetect;
    private m_player: Player;

    public StandBalance() {
        const constantForce = this.m_head.addComponent(ConstantForce);
        const k = this.m_StandUpForce + this.m_StandUpMultiForce;
        constantForce.force = VectorUtil.Vector3.up.multiplyScalar(k);
    }
    protected start () {
        // Your initialization goes here.
        this.m_jointAnimationMgr = this.node.getComponent(JointAnimationMgr);
        this.m_bodyDetect = this.node.getComponent(BodyDetect);
        this.m_rigids = this.m_jointAnimationMgr.m_rigids;
        this.m_StandUpForce = this.GetTotalMassInChild();
    }

    protected update (deltaTime: number) {
        // Your update function goes here.
        this.m_StandUpMultiForce = this.m_UpMuliForceFadeSpeed * (this.m_headBalanceHeight - this.m_bodyDetect.mheadDistanceToGround);

    }
    private ExternalGravity() {
        for (let i = 0; i < this.m_rigids.length; i++) {
            const rigid = this.m_rigids[i];
            const constantForce = this.m_head.addComponent(ConstantForce);
            const k = this.m_StandUpForce + this.m_StandUpMultiForce;
            constantForce.force = VectorUtil.Vector3.up.multiplyScalar(k);
        }
    }

    /**
     * 计算角色整体的质量
     *
     * @private
     * @returns
     * @memberof StayStanding
     */
    private GetTotalMassInChild() {

        let m_StandUpForce = 0;
        for (let i = 0; i < this.m_rigids.length; i++) {
            m_StandUpForce += this.m_rigids[i].mass;
        }
        return m_StandUpForce;
    }
}
