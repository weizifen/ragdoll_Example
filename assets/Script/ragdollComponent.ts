import { _decorator, Component, Node, PhysicsSystem, RigidBody, Vec3, macro } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RagdollComponent")
export class RagdollComponent extends Component {
    @property({type: Node, tooltip: "头部"})
    private head: Node = null;
    @property({type: Node, tooltip: "脖子"})
    private neck: Node = null;
    @property({type: Node, tooltip: "躯干"})
    private torso: Node = null;
    @property({type: Node, tooltip: "臀部"})
    private hip: Node = null;
    @property({type: Node, tooltip: "Right上臂"})
    private upperRightArm: Node = null;
    @property({type: Node, tooltip: "Left上臂"})
    private upperLeftArm: Node = null;
    @property({type: Node, tooltip: "Right下臂"})
    private lowerRightArm: Node = null;
    @property({type: Node, tooltip: "Left下臂"})
    private lowerLeftArm: Node = null;

    @property({type: Node, tooltip: "Right手"})
    private handRight: Node = null;
    @property({type: Node, tooltip: "Left手"})
    private handLeft: Node = null;

    @property({type: Node, tooltip: "Right大腿"})
    private upperRightLeg: Node = null;
    @property({type: Node, tooltip: "Left大腿"})
    private upperLeftLeg: Node = null;
    @property({type: Node, tooltip: "Right小腿"})
    private lowerRightLeg: Node = null;
    @property({type: Node, tooltip: "Left小腿"})
    private lowerLeftLeg: Node = null;

    private shouldersDistance;
    private upperArmLength;
    private lowerArmLength;
    private neckLength;
    private headRadius;
    private torsoLength;
    private hipLength;
    private upperLegLength;
    private lowerLegLength;

    protected start () {
        // Your initialization goes here.
        this.createRagdoll();
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
    private createRagdoll () {
        const scale = 1;
        this.shouldersDistance = this.torso.scale.x * scale; // 肩膀距离
        this.upperArmLength = this.upperLeftArm.scale.x * scale;
        this.lowerArmLength = this.lowerLeftArm.scale.x * scale;
        this.neckLength = this.neck.scale.y * scale;
        this.headRadius = (this.head.scale.x / 2) * scale;
        this.torsoLength = this.torso.scale.y * scale;
        this.hipLength = this.hip.scale.y * scale;
        this.upperLegLength = this.upperLeftLeg.scale.y * scale;
        this.lowerLegLength = this.lowerLeftLeg.scale.y * scale;

        this.joinConnect();
    }
    /**
     * 关节约束
     *
     * @private
     * @memberof RagdollComponent
     */
    private joinConnect () {
        const angleA = 10 / macro.DEG;
        const angleB  = 0;
        const twistAngle = 10 / macro.DEG;
        const cannonWorld = PhysicsSystem.instance.physicsWorld.impl;
        // 颈关节（上）
        const head: any = (this.head.getComponent(RigidBody) as any)._body.impl;
        const neck: any = (this.neck.getComponent(RigidBody) as any)._body.impl;

        // 锥扭转约束: 锥形扭曲约束限制两个物体之间的运动和旋转，类似于肩膀或脚踝等人的关节。在这个约束中，两个对象是必需的。
        const neckJoint1 = new CANNON.ConeTwistConstraint(head, neck, {
            pivotA: new CANNON.Vec3(0, -this.headRadius, 0),
            pivotB: new CANNON.Vec3(0, this.neckLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle,
        });
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(neckJoint1);

        // 颈关节（下）
        const torso: any = (this.torso.getComponent(RigidBody) as any)._body.impl;
        // 锥扭转约束: 锥形扭曲约束限制两个物体之间的运动和旋转，类似于肩膀或脚踝等人的关节。在这个约束中，两个对象是必需的。
        const neckJoint2 = new CANNON.ConeTwistConstraint(neck, torso, {
            pivotA: new CANNON.Vec3(0, -this.neckLength / 2, 0),
            pivotB: new CANNON.Vec3(0, this.torsoLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle,
        });
        cannonWorld.addConstraint(neckJoint2);

        // 膝关节
        const lowerLeftLeg: any = (this.lowerLeftLeg.getComponent(RigidBody) as any)._body.impl;
        const upperLeftLeg: any = (this.upperLeftLeg.getComponent(RigidBody) as any)._body.impl;

        const lowerRightLeg: any = (this.lowerRightLeg.getComponent(RigidBody) as any)._body.impl;
        const upperRightLeg: any = (this.upperRightLeg.getComponent(RigidBody) as any)._body.impl;
        // 锥扭转约束
        const options = {
            pivotA: new CANNON.Vec3(0, this.lowerLegLength / 2, 0),
            pivotB: new CANNON.Vec3(0, -this.upperLegLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle,
        };
        const leftKneeJoint = new CANNON.ConeTwistConstraint(lowerLeftLeg, upperLeftLeg, options);
        const rightKneeJoint = new CANNON.ConeTwistConstraint(lowerRightLeg, upperRightLeg, options);

        // 把约束放入物理世界数组
        cannonWorld.addConstraint(leftKneeJoint);
        cannonWorld.addConstraint(rightKneeJoint);

        // 髋关节
        const hip: any = (this.hip.getComponent(RigidBody) as any)._body.impl;

        const leftHipJoint = new CANNON.ConeTwistConstraint(upperLeftLeg, hip, {
            pivotA: new CANNON.Vec3(0, this.upperLegLength / 2, 0),
            pivotB: new CANNON.Vec3(-this.shouldersDistance / 2, -this.hipLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle,
        });
        const rightHipJoint = new CANNON.ConeTwistConstraint(upperRightLeg, hip, {
            pivotA: new CANNON.Vec3(0, this.upperLegLength / 2, 0),
            pivotB: new CANNON.Vec3(this.shouldersDistance / 2, -this.hipLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle,
        });
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(leftHipJoint);
        cannonWorld.addConstraint(rightHipJoint);

        // 脊柱
        const optionSpine = {
            pivotA: new CANNON.Vec3(0, -this.torsoLength / 2, 0),
            pivotB: new CANNON.Vec3(0, this.hipLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle,
        };
        const spineJoint = new CANNON.ConeTwistConstraint(torso, hip, optionSpine);
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(spineJoint);

        // 肩膀
        const upperLeftArm: any = (this.upperLeftArm.getComponent(RigidBody) as any)._body.impl;
        const upperRightArm: any = (this.upperRightArm.getComponent(RigidBody) as any)._body.impl;

        const leftShoulder = new CANNON.ConeTwistConstraint(upperLeftArm, torso, {
            pivotB: new CANNON.Vec3(-this.shouldersDistance / 2, this.torsoLength / 2, 0),
            pivotA: new CANNON.Vec3(this.upperArmLength / 2, 0, 0),
            axisB: CANNON.Vec3.UNIT_X,
            axisA: CANNON.Vec3.UNIT_X,
            angle: angleB,
        });
        const rightShoulder = new CANNON.ConeTwistConstraint(upperRightArm, torso, {
            pivotB: new CANNON.Vec3(this.shouldersDistance / 2, this.torsoLength / 2, 0),
            pivotA: new CANNON.Vec3(-this.upperArmLength / 2, 0, 0),
            axisB: CANNON.Vec3.UNIT_X,
            axisA: CANNON.Vec3.UNIT_X,
            angle: angleB,
        });
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(leftShoulder);
        cannonWorld.addConstraint(rightShoulder);

        // 肘关节
        const lowerLeftArm: any = (this.lowerLeftArm.getComponent(RigidBody) as any)._body.impl;
        const lowerRightArm: any = (this.lowerRightArm.getComponent(RigidBody) as any)._body.impl;

        const leftElbowJoint = new CANNON.ConeTwistConstraint(lowerLeftArm, upperLeftArm, {
            pivotA: new CANNON.Vec3(this.lowerArmLength / 2, 0, 0),
            pivotB: new CANNON.Vec3(-this.upperArmLength / 2, 0, 0),
            axisA: CANNON.Vec3.UNIT_X,
            axisB: CANNON.Vec3.UNIT_X,
            angle: angleA,
            twistAngle,
        });
        const rightElbowJoint = new CANNON.ConeTwistConstraint(lowerRightArm, upperRightArm, {
            pivotA: new CANNON.Vec3(-this.lowerArmLength / 2, 0, 0),
            pivotB: new CANNON.Vec3(this.upperArmLength / 2, 0, 0),
            axisA: CANNON.Vec3.UNIT_X,
            axisB: CANNON.Vec3.UNIT_X,
            angle: angleA,
            twistAngle,
        });
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(leftElbowJoint);
        cannonWorld.addConstraint(rightElbowJoint);

        const handLeft = (this.handLeft.getComponent(RigidBody) as any)._body.impl;
        const handRight = (this.handRight.getComponent(RigidBody) as any)._body.impl;

        const leftWristJoints = new CANNON.ConeTwistConstraint(handLeft, lowerLeftArm, {
            pivotA: new CANNON.Vec3(this.handLeft.scale.x / 2, 0, 0),
            pivotB: new CANNON.Vec3(-this.lowerLeftArm.scale.x / 2, 0, 0),
            axisA: CANNON.Vec3.UNIT_X,
            axisB: CANNON.Vec3.UNIT_X,
            angle: angleA,
            twistAngle,
        });

        const rightWristJoints2 = new CANNON.ConeTwistConstraint(handRight, lowerRightArm, {
            pivotA: new CANNON.Vec3(-this.handRight.scale.x / 2, 0, 0),
            pivotB: new CANNON.Vec3(this.lowerRightArm.scale.x / 2, 0, 0),
            axisA: CANNON.Vec3.UNIT_X,
            axisB: CANNON.Vec3.UNIT_X,
            angle: angleA,
            twistAngle,
        });
        cannonWorld.addConstraint(leftWristJoints);
        cannonWorld.addConstraint(rightWristJoints2);
    }
}
