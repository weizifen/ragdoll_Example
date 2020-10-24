import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('VectorUtil')
export class VectorUtil extends Component {
    public static Vector3 = {
        up: new Vec3(0, 1, 0),
        down: new Vec3(0, -1, 0),
    };
}
