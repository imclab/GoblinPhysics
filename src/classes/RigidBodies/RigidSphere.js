/**
 * A rigid sphere implementation
 *
 * @class RigidSphere
 * @param radius {Number} sphere radius
 * @param mass {Number} mass of the sphere
 * @constructor
 */
Goblin.RigidSphere = function( radius, mass ) {
	Goblin.RigidBody.call( this, radius, mass );
};
Goblin.RigidSphere.prototype = new Goblin.RigidBody();

/**
 * Given `direction`, find the point in this body which is the most extreme in that direction.
 * This support point is calculated in world coordinates and stored in the second parameter `support_point`
 *
 * @method findSupportPoint
 * @param direction {vec3} direction to use in finding the support point
 * @param support_point {vec3} vec3 variable which will contain the supporting point after calling this method
 */
Goblin.RigidSphere.prototype.findSupportPoint = function( direction, support_point ) {
	var localized_direction = _tmp_vec3_1,
		world_to_local_rotation_transform = _tmp_quat4_1;

	// @TODO shouldn't need to transform the search direction first, but rather align the support point with the search direction after it has been calculated

	// First transform the direction vector into the body's local frame
	quat4.inverse( this['rotation'], world_to_local_rotation_transform );
	quat4.multiplyVec3( world_to_local_rotation_transform, direction, localized_direction );
	/*
	 support_point = radius * (normalized)direction
	*/

	//vec3.normalize( direction, localized_direction );
	vec3.normalize( localized_direction );
	vec3.scale( localized_direction, this['bounding_radius'], support_point );

	// Transform the localized support point into world coordinates
	mat4.multiplyVec3( this['transform'], support_point );
};

// mappings for closure compiler
Goblin['RigidSphere'] = Goblin.RigidSphere;
Goblin.RigidSphere.prototype['findSupportPoint'] = Goblin.RigidSphere.prototype.findSupportPoint;