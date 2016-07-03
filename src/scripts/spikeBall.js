import THREE from 'three';
import explodeModifier from './explodeModifier';
import calculateCentroid from './utils/centeroid';

export default class SpikeBall {
    constructor(gui) {
        this.config = {
            speed: 800,
            radius: 400,
            detail: 2,
            min: 350,
            max: 300,
            delay: 500,
        };

        const geometry = new THREE.IcosahedronGeometry(
            this.config.radius,
            this.config.detail);

        this.geometry = explodeModifier(geometry);

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 1,
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);
        this.setScalar();
        this.initGui(gui);
    }

    initGui(gui) {
        const folder = gui.addFolder('Sphere');
        folder.add(this.config, 'min', 0, 800);
        folder.add(this.config, 'max', 0, 1000);
        folder.add(this.config, 'speed', 1, 1000);
        folder.add(this.config, 'delay', 0, 1000);
    }

    setScalar() {
        const { vertices } = this.mesh.geometry;
        const vLen = vertices.length;

        for (let i = 0; i < vLen; i += 4) {
            const A = vertices[i + 0];
            const B = vertices[i + 1];
            const C = vertices[i + 2];
            const D = vertices[i + 3];
            const cent = calculateCentroid([A, B, C]);

            A.add(cent);
            B.add(cent);
            C.add(cent);
            D.multiplyScalar(1);
        }

        this.mesh.geometry.verticesNeedUpdate = true;
    }

    update(timeStamp) {
        const { speed, min, max, delay } = this.config;
        const { vertices } = this.mesh.geometry;
        const vLen = vertices.length;

        for (let i = 0; i < vLen; i += 4) {
            const A = vertices[i + 0];
            const B = vertices[i + 1];
            const C = vertices[i + 2];
            const D = vertices[i + 3];

            const wave = min + Math.abs((Math.sin((timeStamp / speed))) * max);
            const waveD = min + Math.abs((Math.sin(((timeStamp - delay) / speed))) * max);
            A.normalize().multiplyScalar(wave);
            B.normalize().multiplyScalar(wave);
            C.normalize().multiplyScalar(wave);
            D.normalize().multiplyScalar(waveD);
        }

        this.mesh.rotation.y += 0.001;
        this.mesh.rotation.x += 0.003;
        this.mesh.rotation.z += 0.002;

        this.mesh.geometry.verticesNeedUpdate = true;
    }
}
