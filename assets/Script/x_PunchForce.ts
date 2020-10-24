import { _decorator, Component, Node, Vec3, Collider, ICollisionEvent, BoxCollider, v3, SphereCollider } from 'cc';
import { Target } from './target';
import { VectorUtil } from './extend/vectorUtil';
const { ccclass, property } = _decorator;

@ccclass('XPunchForce')
export class XPunchForce extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;
    @property
    public IsCollisionGround: boolean = false;
    @property
    public IsCollisionWall: boolean = false;


    public groundPoint: Vec3 = new Vec3(); // 地面碰撞点
    public wallPoint: Vec3 = new Vec3();   // 墙面碰撞点
    public wallnormal: Vec3 = new Vec3();  // 碰撞法线方向

    public m_StemEmptyTime: number;
    public m_StemEmptyTimer: number; // 踩空时间

    private _collider: Collider;

    private base: Node;

    protected start() {
        // Your initialization goes here.
        let collider: Collider = this.node.getComponent(BoxCollider);
        if (!collider) {
            collider = this.node.getComponent(SphereCollider);
        }
        this.base = this.node;

        collider.on("onCollisionEnter", this.onCollisionEnter, this);
        collider.on("onCollisionExit", this.onCollisionExit, this);
        collider.on("onCollisionStay", this.onCollisionStay, this);
    }

    protected update(deltaTime: number) {
        // Your update function goes here.
        if (this._collider == null) {
            this.Exit();
        }
        if (!this.IsCollisionGround) {
            this.m_StemEmptyTimer += deltaTime;
        }
    }
    private onCollisionEnter(event: ICollisionEvent) {
        // console.log("onCollisionEnter");
        const collider = event.otherCollider;
        const tag = collider.node.getComponent(Target).tag;
        if (tag === "Rigidbodys" || tag === "wall") {
            return;
        }

        const normal: Vec3 = new Vec3();
        event.contacts[0].getWorldNormalOnB(normal);
        if (Vec3.angle(VectorUtil.Vector3.up, normal) > 95){ // 朝碰撞体反面跳
            return;
        }
        this._collider = collider;
        if (Vec3.angle(VectorUtil.Vector3.up, normal) < 70 && tag === "Ground"){
            this.IsCollisionGround = true;
            event.contacts[0].getWorldPointOnA(this.groundPoint);
        }

        if (Vec3.angle(VectorUtil.Vector3.up, normal) > 75){
            if (tag === "bullet" || tag === "weapon" || tag === "airwall") {
                return;
            }
            this.wallnormal = normal;
            this.IsCollisionWall = true;
            this.m_StemEmptyTimer = 1;
            event.contacts[0].getWorldPointOnA(this.wallPoint);
        }
    }
    private onCollisionStay(event: ICollisionEvent) {
        // console.log("onCollisionEnter");
        const collider = event.otherCollider;
        const tag = collider.node.getComponent(Target).tag;
        if (tag === "Rigidbodys" || tag === "wall") {
            return;
        }

        const normal: Vec3 = new Vec3();
        event.contacts[0].getWorldNormalOnB(normal);
        if (Vec3.angle(VectorUtil.Vector3.up, normal) > 95){ // 朝碰撞体反面跳
            return;
        }
        this._collider = collider;

        if (Vec3.angle(VectorUtil.Vector3.up, normal) < 70 && tag === "Ground"){
            this.IsCollisionGround = true;
            event.contacts[0].getWorldPointOnA(this.groundPoint);
        }

        if (Vec3.angle(VectorUtil.Vector3.up, normal) > 75){
            if (tag === "bullet" || tag === "weapon" || tag === "airwall") {
                return;
            }
            this.wallnormal = normal;
            this.IsCollisionWall = true;
            this.m_StemEmptyTimer = 1;
            event.contacts[0].getWorldPointOnA(this.wallPoint);
        }
    }
    private onCollisionExit(event: ICollisionEvent) {
        // console.log("onCollisionExit");
        const collider = event.otherCollider;
        // 该对象有标签吗  CompareTag
        const tag = collider.node.getComponent(Target).tag;
        if (tag === "Ground" || tag === "Rigidbodys") {
            this.IsCollisionGround = false;
            this.IsCollisionWall = false;
        }
    }
    private Exit() {
        this.IsCollisionGround = false;
        this.IsCollisionWall = false;
    }
}
