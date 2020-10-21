import { _decorator, Component, Node, RigidBody, PhysicsSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RagdollComponent')
export class RagdollComponent extends Component {
    @property({type: Node, tooltip: "头部"})
    private head: Node = null;
    @property({type: Node, tooltip: "上身形状"})
    private upperBody: Node = null;
    @property({type: Node, tooltip: "盆骨形状"})
    private pelvis: Node = null;
    @property({type: Node, tooltip: "Left上臂形状"})
    private upperLeftArm: Node = null;
    @property({type: Node, tooltip: "Left下臂形状"})
    private lowerLeftArm: Node = null;
    @property({type: Node, tooltip: "Right上臂形状"})
    private upperRightArm: Node = null;
    @property({type: Node, tooltip: "Right下臂形状"})
    private lowerRightArm: Node = null;
    @property({type: Node, tooltip: "Left大腿形状"})
    private upperLeftLeg: Node = null;
    @property({type: Node, tooltip: "Left小腿形状"})
    private lowerLeftLeg: Node = null;
    @property({type: Node, tooltip: "Right大腿形状"})
    private upperRightLeg: Node = null;
    @property({type: Node, tooltip: "Right小腿形状"})
    private lowerRightLeg: Node = null;

    private shouldersDistance;
    private upperArmLength;
    private lowerArmLength;
    private upperArmSize;
    private lowerArmSize;
    private neckLength;
    private headRadius;
    private upperBodyLength;
    private pelvisLength;
    private upperLegLength;
    private upperLegSize;
    private lowerLegSize;
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
        this.shouldersDistance = this.upperBody.scale.x * scale; // 肩膀距离
        this.upperArmLength = this.upperLeftArm.scale.x * scale;
        this.lowerArmLength = this.lowerLeftArm.scale.x * scale;
        this.upperArmSize = 0.2 * scale;
        this.lowerArmSize = 0.2 * scale;
        this.neckLength = 0.03 * scale;
        this.headRadius = (this.head.scale.x / 2) * scale;
        this.upperBodyLength = this.upperBody.scale.y * scale;
        this.pelvisLength = this.pelvis.scale.y * scale;
        this.upperLegLength = this.upperLeftLeg.scale.y * scale;
        this.upperLegSize = 0.2 * scale;
        this.lowerLegSize = 0.2 * scale;
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
        const angleA = 0;
        const angleB  = 0;
        const twistAngle = 0;
        const cannonWorld = PhysicsSystem.instance.physicsWorld.impl;
        // 颈关节
        const head: any = (this.head.getComponent(RigidBody) as any)._body.impl;
        const upperBody: any = (this.upperBody.getComponent(RigidBody) as any)._body.impl;
        // 锥扭转约束
        const neckJoint = new CANNON.ConeTwistConstraint(head, upperBody, {
            pivotA: new CANNON.Vec3(0, -this.headRadius - this.neckLength / 2, 0),
            pivotB: new CANNON.Vec3(0, this.upperBodyLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle: twistAngle
        });
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(neckJoint);

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
        const pelvis: any = (this.pelvis.getComponent(RigidBody) as any)._body.impl;

        const leftHipJoint = new CANNON.ConeTwistConstraint(upperLeftLeg, pelvis, {
            pivotA: new CANNON.Vec3(0, this.upperLegLength / 2, 0),
            pivotB: new CANNON.Vec3(-this.shouldersDistance / 2, -this.pelvisLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle
        });
        const rightHipJoint = new CANNON.ConeTwistConstraint(upperRightLeg, pelvis, {
            pivotA: new CANNON.Vec3(0, this.upperLegLength / 2, 0),
            pivotB: new CANNON.Vec3(this.shouldersDistance / 2, -this.pelvisLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle
        });
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(leftHipJoint);
        cannonWorld.addConstraint(rightHipJoint);


        // 脊柱
        const optionSpine = {
            pivotA: new CANNON.Vec3(0, this.pelvisLength / 2, 0),
            pivotB: new CANNON.Vec3(0, -this.upperBodyLength / 2, 0),
            axisA: CANNON.Vec3.UNIT_Y,
            axisB: CANNON.Vec3.UNIT_Y,
            angle: angleA,
            twistAngle,
        };
        const spineJoint = new CANNON.ConeTwistConstraint(pelvis, upperBody, optionSpine);
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(spineJoint);


        // 肩膀
        const upperLeftArm: any = (this.upperLeftArm.getComponent(RigidBody) as any)._body.impl;
        const upperRightArm: any = (this.upperRightArm.getComponent(RigidBody) as any)._body.impl;

        const leftShoulder = new CANNON.ConeTwistConstraint(upperBody, upperLeftArm, {
            pivotA: new CANNON.Vec3(-this.shouldersDistance / 2, this.upperBodyLength / 2, 0),
            pivotB: new CANNON.Vec3(this.upperArmLength / 2, 0, 0),
            axisA: CANNON.Vec3.UNIT_X,
            axisB: CANNON.Vec3.UNIT_X,
            angle: angleB,
        });
        const rightShoulder = new CANNON.ConeTwistConstraint(upperBody, upperRightArm, {
            pivotA: new CANNON.Vec3(this.shouldersDistance / 2, this.upperBodyLength / 2, 0),
            pivotB: new CANNON.Vec3(-this.upperArmLength / 2, 0, 0),
            axisA: CANNON.Vec3.UNIT_X,
            axisB: CANNON.Vec3.UNIT_X,
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
            twistAngle: twistAngle
        });
        const rightElbowJoint = new CANNON.ConeTwistConstraint(lowerRightArm, upperRightArm, {
            pivotA: new CANNON.Vec3(-this.lowerArmLength / 2, 0, 0),
            pivotB: new CANNON.Vec3(this.upperArmLength / 2, 0, 0),
            axisA: CANNON.Vec3.UNIT_X,
            axisB: CANNON.Vec3.UNIT_X,
            angle: angleA,
            twistAngle: twistAngle
        });
        // 把约束放入物理世界数组
        cannonWorld.addConstraint(leftElbowJoint);
        cannonWorld.addConstraint(rightElbowJoint);
    }
}
