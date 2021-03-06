Goblin.ContactConstraint = function() {
	Goblin.Constraint.call( this );
	this.contact = null;
};

Goblin.ContactConstraint.prototype.buildFromContact = function( contact ) {
	var row = this.rows[0] || Goblin.ObjectPool.getObject( 'ConstraintRow' );

	this.object_a = contact.object_a;
	this.object_b = contact.object_b;
	this.contact = contact;

	row.lower_limit = 0;
	row.upper_limit = Infinity;

	if ( this.object_a == null || this.object_a.mass === Infinity ) {
		row.jacobian[0] = row.jacobian[1] = row.jacobian[2] = 0;
		row.jacobian[3] = row.jacobian[4] = row.jacobian[5] = 0;
	} else {
		row.jacobian[0] = -contact.contact_normal[0];
		row.jacobian[1] = -contact.contact_normal[1];
		row.jacobian[2] = -contact.contact_normal[2];

		vec3.subtract( contact.contact_point, contact.object_a.position, _tmp_vec3_1 );
		vec3.cross( _tmp_vec3_1, contact.contact_normal, _tmp_vec3_1 );
		row.jacobian[3] = -_tmp_vec3_1[0];
		row.jacobian[4] = -_tmp_vec3_1[1];
		row.jacobian[5] = -_tmp_vec3_1[2];
	}

	if ( this.object_b == null || this.object_b.mass === Infinity ) {
		row.jacobian[6] = row.jacobian[7] = row.jacobian[8] = 0;
		row.jacobian[9] = row.jacobian[10] = row.jacobian[11] = 0;
	} else {
		row.jacobian[6] = contact.contact_normal[0];
		row.jacobian[7] = contact.contact_normal[1];
		row.jacobian[8] = contact.contact_normal[2];

		vec3.subtract( contact.contact_point, contact.object_b.position, _tmp_vec3_1 );
		vec3.cross( _tmp_vec3_1, contact.contact_normal, _tmp_vec3_1 );
		row.jacobian[9] = _tmp_vec3_1[0];
		row.jacobian[10] = _tmp_vec3_1[1];
		row.jacobian[11] = _tmp_vec3_1[2];
	}

	// Pre-calc error
	row.bias = contact.penetration_depth;

	// Apply restitution
	var dot, velocity;
	dot = vec3.dot( this.object_a.linear_velocity, contact.contact_normal );
	vec3.normalize( this.object_a.linear_velocity, _tmp_vec3_2 );
	vec3.scale( _tmp_vec3_2, dot );

	dot = vec3.dot( this.object_b.linear_velocity, contact.contact_normal );
	vec3.normalize( this.object_b.linear_velocity, _tmp_vec3_3 );
	vec3.scale( _tmp_vec3_3, dot );

	// Total collision velocity
	vec3.subtract( _tmp_vec3_2, _tmp_vec3_3 );
	velocity = vec3.length( _tmp_vec3_2 );

	// Add restitution to bias
	row.bias += velocity * contact.restitution;

	this.rows[0] = row;
};