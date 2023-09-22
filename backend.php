<?php  

if(isset($_POST['name']) && isset($_POST['email'])) {
    $name = sanitize_text_field( $_POST['name'] );
    $email = sanitize_text_field( $_POST['email'] );
    $www = sanitize_text_field( $_POST['www'] );
    $phone = sanitize_text_field( $_POST['phone'] );
    $companyDescription = sanitize_text_field( $_POST['companyDescription'] );
    $street = sanitize_text_field( $_POST['street'] );
    $zip = sanitize_text_field( $_POST['zip'] );
    $province = sanitize_text_field( $_POST['province'] );
    $city = sanitize_text_field( $_POST['city'] );
    $keywords = sanitize_text_field( $_POST['keywords'] );

    $post_data = array(
        'post_title'    => $name,
        'post_status'   => 'draft',
        'post_type'     => 'biura-rachunkowe',
    );

    $post_id = wp_insert_post($post_data);

    if($post_id) {
        // Update ACF fields			
        update_field('email', $email, $post_id);
        update_field('phone', $phone, $post_id);
        update_field('website', $www, $post_id);
        update_field('street', $street, $post_id);
        update_field('zip', $zip, $post_id);
        update_field('province', $province, $post_id);
        update_field('city', $city, $post_id);
        update_field('company_description', $companyDescription, $post_id);
        update_field('tags', $keywords, $post_id);
        
        // Assign taxonomies
        $provinceTerm = getTermId($province);
        $cityTerm = getTermId($city);
        
        wp_set_post_terms($post_id, array($provinceTerm, $cityTerm), 'biuro-rachunkowe');

        wp_send_json_success();
        exit();
    } else {
        wp_send_json_error();
        exit();
    }
    
}

function getTermId($term) {
	$taxonomy = 'biuro-rachunkowe';
	
	$term_exists = get_term_by('slug', sanitize_title($term), $taxonomy);
	
	if ($term_exists) {
		return $term_exists->term_id;
	} else {
		$term_data = wp_insert_term($term, $taxonomy);
		if (is_array($term_data) && !empty($term_data['term_id'])) {
			return $term_data['term_id'];
		}
	}

}