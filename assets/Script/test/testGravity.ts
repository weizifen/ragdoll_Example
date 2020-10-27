import { _decorator, Component, Node, ConstantForce, v3, RigidBody, macro, Vec3, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestGravity')
export class TestGravity extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start() {
        // 点击起跳按钮后的初速度 只执行一次的


        const angular = v3(0, 1, 0).multiplyScalar(45 / macro.DEG / 1);
        this.node.getComponent(RigidBody).setAngularVelocity(angular);
        this.scheduleOnce(() => {
            this.node.getComponent(RigidBody).setAngularVelocity(new Vec3(0, 0, 0));
        }, 1);
    }

    update(deltaTime: number) {

        // this.node.getComponent(RigidBody).setAngularVelocity(new Vec3(0, 45 / macro.DEG , 0));

    }
}
