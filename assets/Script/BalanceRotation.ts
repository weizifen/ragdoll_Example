import { _decorator, Component, Node, RigidBody, Vec3, macro, v3, CCObject, find } from 'cc';
import { VectorUtil } from './extend/vectorUtil';
import { JointAnimationMgr } from './jointAnimationMgr';
import { Player } from './player';
const { ccclass, property } = _decorator;
const CELL_TIME = 0.016;

@ccclass('BalanceRotation')
export class BalanceRotation extends Component {
    public TorqueForce: number = 30;


    private mhip: RigidBody = null;
    private mPlayer: Player;

    private mAngle_direction: Vec3 = new Vec3();                // 叉乘向量
    private mAngle: number;                            // 夹角
    private  _jointAnimationMgr: JointAnimationMgr;

    private mtarget: Node = null;

    // 移动速度
    private _vector: Vec3 = Vec3.ZERO;
    // 旋转速度
    private _vectorAngle: Vec3 = Vec3.ZERO;

    protected start () {
        // Your initialization goes here.
        this.mPlayer = this.node.getComponent(Player);
        this._jointAnimationMgr = this.mPlayer.m_JointAnimationMgr;
        this.mhip = this._jointAnimationMgr.m_hip;
        this.mtarget = find("bodyNew/TargetRotation");
        // this.scheduleOnce(() => {


        //     const angular = v3(0, 1, 0).multiplyScalar((90 / macro.DEG / 1) * 1000);
        //     this.mhip.setAngularVelocity(angular);
        //     // this.scheduleOnce(() => {
        //     //     this.mhip.getComponent(RigidBody).setAngularVelocity(new Vec3(0, 0, 0));
        //     // }, 1);
        // }, 5);
    }
    private dotValue;
    protected fixedUpdate(dt: number) {
        const dotValue = this.mhip.node.forward.negative().dot(this.mtarget.forward);
        console.log(dotValue);
        let add = 0;
        if (dotValue > 0) {
            // 目标物体在视野内
            console.log("目标物体在视野内");
        } else {
            console.log("目标物体在视野外");
            add += 180;
        }
        this.dotValue = dotValue;
        this.mAngle = Vec3.angle(this.mhip.node.forward, this.mtarget.forward);
        Vec3.cross(this.mAngle_direction, this.mhip.node.forward, this.mtarget.forward);
        this.AddTorqueWithHip();

        // const angular = v3(0, 1, 0).multiplyScalar((this.angle / macro.DEG / 1) * 1000);
        // this.mhip.setAngularVelocity(angular);
        // console.log(this.mhip.node.forward);

    }

    protected _now_time = 0;
    protected update(dt: number) {
        this.mtarget.eulerAngles = new Vec3(0, this.angle, 0);

        this._now_time += dt;
        while (this._now_time >= CELL_TIME) {
            this.fixedUpdate(CELL_TIME);
            this._now_time -= CELL_TIME;
        }
    }

    private angle = 0;
    /** 移动摇杆触发回调 */
    private joysitckCallback(vector: Vec3, angle: number) {
        console.log(vector, angle);

        // 根据摄像机的角度旋转
        // Vec3.rotateZ(vector, vector, Vec3.ZERO, this.node_camera.eulerAngles.y * macro.RAD);
        // this._vector = vector.normalize();
        if (angle) {
            // 模型初始朝前，补个90度
            this.angle = angle + 90;
            // const normal = vector.normalize().multiplyScalar(4);
            this.mhip.setLinearVelocity(new Vec3(0, 0, this.mhip.node.forward.z).normalize().negative().multiplyScalar(4));
        }
    }

    /** 旋转摇杆触发回调 */
    private joysitckAngleCallback(vector: Vec3, angle: number) {
        this._vectorAngle = vector.normalize();
    }

    /// <summary>
    /// 根据target点和角色旋转的角度差给对应方向，对应大小力的扭矩
    /// </summary>
    private AddTorqueWithHip() {
        const v = this.mAngle * this.TorqueForce;
        if (this.dotValue > 0) {
            if (this.mAngle_direction.y > 0) {
                console.log("位于玩家左前方");
                this.mhip.applyTorque(VectorUtil.Vector3.up.negative().clone().multiplyScalar(v));
            }
            else if (this.mAngle_direction.y < 0) {
                console.log("位于玩家右前方");
                this.mhip.applyTorque(VectorUtil.Vector3.up.clone().multiplyScalar(v));
            }
        }
    }
}
