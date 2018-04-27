$(document).ready(function() {
	drone = ParrotDrone();
	$(".connect").click(function() {
		$(".connect").text("Connecting");
		$(".container").slideDown(1000);
		drone.connect()
		.then(() => {
			$(".connect").text("Connected");
			$(".disconnect").removeAttr("disabled");
			$(".container").slideDown(1000);
		})
		.catch(() => {
			$(".connect").text("Error Connecting");
			$("#panel #status").text("Status: Error Connecting");
		});
	});
	
	$(".disconnect").click(function() {
		if(confirm("Disconnect from drone?")) {
			drone.land()
			.then(() => {
				drone.disconnect();
				$(".connect").text("Connect");
				$(".disconnect").attr("disabled", "disabled");
				$("#panel #status").text("Status: Disconnected");
			});
		}
	});
})
var start = Date.now();
var is_recording = false;
var routine = [
	];
// keydown handler
$(document).keydown(function(e) {
	function updateDisplay() {
		var new_stats = drone.getDistances();
		console.log(new_stats);
		
		$("ul#stats #x").text("X: "+new_stats.x);
		$("ul#stats #y").text("Y: "+new_stats.y);
		$("ul#stats #z").text("Z: "+new_stats.z);
		$("ul#stats #rot_slow").text("Rotation (Slow): "+((new_stats.rot%1200)/1200*360)+" deg");
		$("ul#stats #rot_fast").text("Rotation (Fast): "+((new_stats.rot%8100)/8100*360)+" deg");
	}
	//console.log(e.keyCode);
	switch (e.keyCode) {
		// Rotate left
		case 37:
			if(is_recording) routine.push(["rotateLeft",Date.now()-start]);
			drone.applyRotateLeft();
			keys_down["rotate_left"] = true;
			break;
		// Move Forward
		case 38:
			if(is_recording) routine.push(["forward",Date.now()-start]);
			drone.applyForward();
			keys_down["move_forward"] = true;
			break;
		// Rotate right
		case 39:
			if(is_recording) routine.push(["rotateRight",Date.now()-start]);
			drone.applyRotateRight();
			keys_down["rotate_right"] = true;
			break;
		// Move Backward
		case 40:
			if(is_recording) routine.push(["backward",Date.now()-start]);
			drone.applyBackward();
			keys_down["move_backward"] = true;
			break;
		
		// Move left
		case 65:
			drone.applyLeft();
			keys_down["move_left"] = true;
			break;
		// Move right
		case 68:
			drone.applyRight();
			keys_down["move_right"] = true;
			break;
			
		// Altitude Up
		case 87:
			drone.applyUp();
			keys_down["alt_up"] = true;
			break;
		// Altitude down
		case 83:
			drone.applyDown();
			keys_down["alt_down"] = true;
			break;
		
		
		// Take off/land
		case 13:
			if(is_flying) {
				user_action = "Landing";
				drone.land();
			} else {
				user_action = "Taking Off";
				drone.takeOff();
			}
			is_flying = !is_flying;
			break;
		
		// Emergency stop (crash land)
		case 27:
			user_action = "Emergency Stop";
			console.log(user_action);
			drone.emergencyStop();
			
			is_flying = false;
			break;
		
		// Hover
		case 32:
			user_action = "Hover";
			console.log(user_action);
			drone.hover();
			break;
		
		// Flip
		case 70:
			user_action = "Flip";
			console.log(user_action);
			drone.flip();
			break;
		
		// Record
		case 76:
			user_action = "Recording";
			console.log(user_action);
			
			if(is_recording) is_recording = false;
			else {
				start = Date.now();
				is_recording = true;
			}
			break;
	}
	
	
	if(keys_down["move_forward"]&&keys_down["rotate_left"]) {
		user_action = "Forward-Left";
		drone.moveForwardLeft();
	} else if(keys_down["move_forward"]&&keys_down["rotate_right"]) {
		user_action = "Forward-Right";
		drone.moveForwardRight();
	} else if(keys_down["move_backward"]&&keys_down["rotate_left"]) {
		user_action = "Backward-Left";
		drone.moveBackwardLeft();
	} else if(keys_down["move_backward"]&&keys_down["rotate_right"]) {
		user_action = "Backward-Right";
		drone.moveBackwardRight();
	}
	
	else if(keys_down["move_forward"]&&keys_down["alt_up"]){
		user_action = "Forward Up";
		drone.moveForwardUp();
	} else if(keys_down["move_forward"]&&keys_down["alt_down"]){
		user_action = "Forward Down";
		drone.moveForwardDown();
	} else if(keys_down["move_backward"]&&keys_down["alt_up"]){
		user_action = "Backward Up";
		drone.moveBackwardUp();
	} else if(keys_down["move_backward"]&&keys_down["alt_down"]){
		user_action = "Backward Down";
		drone.moveBackwardDown();
	} 
	
	else if(keys_down["move_forward"]) {
		user_action = "Forward";
		drone.moveForwards();
	} else if(keys_down["move_backward"]) {
		user_action = "Backward";
		drone.moveBackwards();
	} else if(keys_down["rotate_left"]) {
		user_action = "Left";
		drone.rotateLeft();
	} else if(keys_down["rotate_right"]) {
		user_action = "Right";
		drone.rotateRight();
	} else if(keys_down["move_left"]) {
		user_action = "Left";
		drone.moveLeft();
	} else if(keys_down["move_right"]) {
		user_action = "Right";
		drone.moveRight();
	}
	
	else if(keys_down["alt_up"]) {
		user_action = "Up";
		drone.altitudeUp();
	} else if(keys_down["alt_down"]) {
		user_action = "Down";
		drone.altitudeDown();
	}
	
	$(".info .inner").prepend((++comm_count)+": "+user_action+"<br>");
	updateDisplay();
});
function run_routine() {
	if(routine.length>0) {
		setTimeout(function() {
			console.log(routine[0][0]);
			if(routine[0][0] == "move_forward") {
				drone.applyForward();
			}
			else if(routine[0][0] == "r_forward") {
				drone.removeForward();
			}
			
			else if(routine[0][0] == "move_backward") {
				drone.applyBackward();
			}
			else if(routine[0][0] == "r_backward") {
				drone.removeBackward();
			}
			routine.shift();
			run_routine();
		}, routine[0][1]);
	}
}

$(".routine").click(function() {
	run_routine();
	/*
	setTimeout(function() {
		drone.applyForward();
		drone.applyRotateRight();
		setTimeout(function() {
			drone.removeForward();
			drone.removeRotateLeft();
		},1000);
	}, 1000);
	setTimeout(function() {
		drone.applyRotateRight();
		setTimeout(function() {
			drone.removeRotateLeft();
		},3000);
	}, 2000);
	//setTimeout(function() {
	//	drone.land();
	//}, 4000);*/
});

$(document).keyup(function(e) {
	switch(e.keyCode) {
		// Rotate left
		case 37:
			if(is_recording) routine.push(["r_rotateLeft",Date.now()-start]);
			drone.removeRotateLeft();
			delete keys_down["rotate_left"];
			break;
		// Move Forward
		case 38:
			if(is_recording) routine.push(["r_forward",Date.now()-start]);
			drone.removeForward();
			delete keys_down["move_forward"];
			break;
		// Rotate right
		case 39:
			if(is_recording) routine.push(["r_rotateRight",Date.now()-start]);
			drone.removeRotateRight();
			delete keys_down["rotate_right"];
			break;
		// Move Backward
		case 40:
			if(is_recording) routine.push(["r_backward",Date.now()-start]);
			drone.removeBackward();
			delete keys_down["move_backward"];
			break;
		
		
		// Move left
		case 65:
			drone.removeLeft();
			delete keys_down["move_left"];
			break;
		// Move right
		case 68:
			drone.removeRight();
			delete keys_down["move_right"];
			break;
			
		// Altitude Up
		case 87:
			drone.removeUp();
			delete keys_down["alt_up"];
			break;
		// Altitude down
		case 83:
			drone.removeDown();
			delete keys_down["alt_down"];
			break;
	}
});