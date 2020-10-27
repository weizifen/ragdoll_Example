import { _decorator, Component, Node, RigidBody, Vec3, macro, v3 } from 'cc';
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

    private mAngle_direction: Vec3;                // 叉乘向量
    private mAngle: number;                            // 夹角
    private  _jointAnimationMgr: JointAnimationMgr;

    // 移动速度
    private _vector: Vec3 = Vec3.ZERO;
    // 旋转速度
    private _vectorAngle: Vec3 = Vec3.ZERO;

    protected start () {
        // Your initialization goes here.
        this.mPlayer = this.node.getComponent(Player);
        this._jointAnimationMgr = this.mPlayer.m_JointAnimationMgr;
        this.mhip = this._jointAnimationMgr.m_hip;
        // this.scheduleOnce(() => {


        //     const angular = v3(0, 1, 0).multiplyScalar((90 / macro.DEG / 1) * 1000);
        //     this.mhip.setAngularVelocity(angular);
        //     // this.scheduleOnce(() => {
        //     //     this.mhip.getComponent(RigidBody).setAngularVelocity(new Vec3(0, 0, 0));
        //     // }, 1);
        // }, 5);
    }

    private f = 0;
    protected fixedUpdate(dt: number) {
        // if (this._vector.lengthSqr() > 0) {
        //     this.node.setPosition(this.node.position.add3f(this._vector.x * SPEED * dt, 0, -this._vector.y * SPEED * dt));
        //     this._skeletal.resume();
        // } else {
        //     this._skeletal.pause();
        // }

        // if (this._vectorAngle.lengthSqr() > 0) {
        //     this.node_camera.eulerAngles = this.node_camera.eulerAngles.add3f(0, -this._vectorAngle.x, 0);
        // }


        // this.mhip.setAngularVelocity(new Vec3(0, 2, 0));
        // this.mhip.setAngularVelocity(new Vec3(0, 45 / macro.DEG , 0));

        const angular = v3(0, 1, 0).multiplyScalar((this.angle / macro.DEG / 1) * 1000);
        this.mhip.setAngularVelocity(angular);
        // console.log(this.mhip.node.forward);
        

    }

    protected _now_time = 0;
    protected update(dt: number) {

        // if (this.f < 60) {
        //     this.mhip.setAngularVelocity(new Vec3(0, 90 / macro.DEG , 0));

        //     this.f += 1;
        // }
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
            // this.mPlayer.node.eulerAngles = new Vec3(0, angle + 90, 0);
            // this.mhip.applyTorque(new Vec3(0, angle + 90, 0));
            const normal = vector.normalize().multiplyScalar(4);
            this.mhip.setLinearVelocity(new Vec3(normal.x, 0 , -normal.y));
        }
    }

    /** 旋转摇杆触发回调 */
    private joysitckAngleCallback(vector: Vec3, angle: number) {
        this._vectorAngle = vector.normalize();
    }

    /// <summary>
    /// 根据target点和角色旋转的角度差给对应方向，对应大小力的扭矩
    /// </summary>
    private AddTorqueWithHip(vector: Vec3, angle: number) {
        if (this.mAngle_direction.y > 0) {
            // this.mhip.AddTorque(Vector3.up * mAngle* TorqueForce, ForceMode.Acceleration);
        }
        else {
            // this.mhip.AddTorque(-Vector3.up * mAngle * TorqueForce, ForceMode.Acceleration);
        }
    }
}
