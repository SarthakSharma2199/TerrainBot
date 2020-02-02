class Car {
    constructor(x, y) {
        this.wheels = [];
        this.startingPosition = createVector(x, y);
        this.chassisBody;
        this.chassisWidth = 125;
        this.chassisHeight = 40;
        this.wheelSize = 17;
        this.shapes = [];
        this.carDensity = 1;
        this.carRestitution = 0.01;
        this.motorState = 0;
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2DynamicBody;
        bodyDef.position.x = x / SCALE;
        bodyDef.position.y = y / SCALE;
        bodyDef.angle = 0;

        var fixDef = new b2FixtureDef();
        fixDef.density = this.carDensity;
        fixDef.friction = 0.5;
        fixDef.restitution = this.carRestitution;
        fixDef.shape = new b2PolygonShape();

        let vectors = [];
        vectors.push(new Vec2(-this.chassisWidth / 2, 0 - this.chassisHeight / 2));
        vectors.push(new Vec2(this.chassisWidth / 4 + 5, 0 - this.chassisHeight / 2));

        vectors.push(new Vec2(this.chassisWidth / 2, 0 - this.chassisHeight / 2 + 5));
        vectors.push(new Vec2(this.chassisWidth / 2, this.chassisHeight / 2));
        vectors.push(new Vec2(-this.chassisWidth / 2, this.chassisHeight / 2));
        for (var vect of vectors) {
            vect.x /= SCALE;
            vect.y /= SCALE;
        }

        fixDef.shape.SetAsArray(vectors, vectors.length);
        this.shapes.push(vectors);



        this.chassisBody = world.CreateBody(bodyDef);

        var filtData = new b2FilterData();
        filtData.categoryBits = CHASSIS_CATEGORY;
        filtData.maskBits = CHASSIS_MASK;


        this.chassisBody.CreateFixture(fixDef).SetFilterData(filtData);
        
        var fixDef2 = new b2FixtureDef();
        fixDef2.density = this.carDensity;;
        fixDef2.friction = 0.5;
        fixDef2.restitution = this.carRestitution;
        fixDef2.shape = new b2PolygonShape();

        var vectors2 = [];
        vectors2.push(new Vec2(this.chassisWidth / 4, 0 - this.chassisHeight / 2));
        vectors2.push(new Vec2(this.chassisWidth / 4 - 15, 0 - this.chassisHeight / 2 - 20));
        vectors2.push(new Vec2(this.chassisWidth / 4 - 5, 0 - this.chassisHeight / 2 - 20));
        vectors2.push(new Vec2(this.chassisWidth / 4 + 10, 0 - this.chassisHeight / 2));
        for (var vect of vectors2) {
            vect.x /= SCALE;
            vect.y /= SCALE;
        }
        fixDef2.shape.SetAsArray(vectors2, vectors2.length);
        this.chassisBody.CreateFixture(fixDef2).SetFilterData(filtData);;
        this.shapes.push(vectors2);

        var fixDef3 = new b2FixtureDef();
        fixDef3.density = this.carDensity;;
        fixDef3.friction = 0.1;
        fixDef3.restitution = 0.1;
        fixDef3.shape = new b2PolygonShape();

        var vectors3 = [];
        vectors3.push(new Vec2(this.chassisWidth / 2, 0 - this.chassisHeight / 2 + 5));
        vectors3.push(new Vec2(this.chassisWidth / 2 + 5, 0 - this.chassisHeight / 2 + 8));
        vectors3.push(new Vec2(this.chassisWidth / 2 + 5, this.chassisHeight / 2 - 5));
        vectors3.push(new Vec2(this.chassisWidth / 2, this.chassisHeight / 2));
        for (var vect of vectors3) {
            vect.x /= SCALE;
            vect.y /= SCALE;
        }
        fixDef3.shape.SetAsArray(vectors3, vectors3.length);
        this.chassisBody.CreateFixture(fixDef3).SetFilterData(filtData);;
        this.shapes.push(vectors3);

        this.wheels.push(new Wheel(x - this.chassisWidth / 2 + this.wheelSize * 1.2, y + this.chassisHeight / 2 + this.wheelSize / 4, this.wheelSize, this.chassisBody));
        this.wheels.push(new Wheel(x + this.chassisWidth / 2 - this.wheelSize * 1.2, y + this.chassisHeight / 2 + this.wheelSize / 4, this.wheelSize, this.chassisBody));

        this.person = new Person(x, y, 15, 30); 


        var revJointDef = new b2RevoluteJointDef();
        var jointPos = new Vec2(x / SCALE, y / SCALE);
        revJointDef.Initialize(this.person.torso.body, this.chassisBody, jointPos);
        this.revJoint = world.CreateJoint(revJointDef);

        var distJointDef = new b2DistanceJointDef();
        var anchorPerson = new Vec2(x / SCALE, (y - this.person.height * 2 / 3) / SCALE);
        var anchorCar = new Vec2((x + this.chassisWidth / 2) / SCALE, (y - this.chassisHeight / 2) / SCALE);
        distJointDef.Initialize(this.person.torso.body, this.chassisBody, anchorPerson, anchorCar);
        distJointDef.frequencyHz = 5;
        distJointDef.dampingRatio = 0.1;
        distJointDef.length *= 1.1;
        this.distJoint = world.CreateJoint(distJointDef);

        this.chassisBody.SetAngularDamping(0.1);

        this.rotationTorque = 2;
    }


    show() {

        this.person.show();
        for (var i of this.wheels) {
            i.show();
        }


        let x = this.chassisBody.GetPosition().x * SCALE;
        let y = this.chassisBody.GetPosition().y * SCALE;
        let angle = this.chassisBody.GetAngle();
        push();
        translate(x - panX, y - panY);
        rotate(angle);
       

        image(carSprite, -this.chassisWidth / 2 - 7, -this.chassisHeight - 20, this.chassisWidth + 23, this.chassisHeight * 2 + 10);
        pop();

        panX = x - this.startingPosition.x;
        if (!reset && y > canvas.height) {
            reset = true;
            resetCounter = 10;
        }
        //shit


    }

    update() {
          }



    motorOn(forward) {
        var motorSpeed = 13;
        this.wheels[0].joint.EnableMotor(true);
        this.wheels[1].joint.EnableMotor(true);
        var oldState = this.motorState;
        if (forward) {
            this.motorState = 1;
            this.wheels[0].joint.SetMotorSpeed(-motorSpeed * PI);
            this.wheels[1].joint.SetMotorSpeed(-motorSpeed * PI);

            this.chassisBody.ApplyTorque(-this.rotationTorque);


        } else {
            this.motorState = -1;
            this.wheels[0].joint.SetMotorSpeed(motorSpeed * PI);
            this.wheels[1].joint.SetMotorSpeed(motorSpeed * PI);


        }
        if (oldState + this.motorState == 0) {
            if (oldState == 1) {
                this.applyTorque(this.motorState * -1);
            }
           
        }
        this.wheels[0].joint.SetMaxMotorTorque(700);
        this.wheels[1].joint.SetMaxMotorTorque(350);
    }

    applyTorque(direction) {
        this.chassisBody.ApplyTorque(direction * this.rotationTorque);
    }
    motorOff() {
        switch (this.motorState) {
            case 1:
                this.chassisBody.ApplyTorque(this.motorState * this.rotationTorque);
                break;


        }
        this.motorState = 0;

        this.wheels[0].joint.EnableMotor(false);
        this.wheels[1].joint.EnableMotor(false);
    }



}