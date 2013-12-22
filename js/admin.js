jQuery( document ).ready( function( $ ) {
	var $addGlobalFriendField = $('#add-global-friend-field');
	var $addGlobalFriendButton = $('#add-global-friend-button');
	var nonce = $('#s8d_bpaf_nonce').val();
	var params = { 'nonce':nonce };

console.log(params);

	$addGlobalFriendField.autocomplete({
		source: function(request, response) {
			$.ajax({
				url: ajaxurl + '?action=bpaf_suggest_global_friend',
				dataType: "json",
				data: jQuery.param(params),
				success: function(data) {
					response(data);
				}
			});
		},
		select: function( event, ui ) {
			$addGlobalFriendButton.attr('disabled', false);
			$addGlobalFriendButton.focus();
			updateFieldTextColor();
		},
		search: function( event, ui ) {
			$addGlobalFriendButton.attr('disabled', true);
			$addGlobalFriendField.css( 'color', '#aaa' );
			updateFieldTextColor();
		},

	});

	function updateFieldTextColor() {
		var buttonTextColor = $addGlobalFriendButton.css('color');
		$addGlobalFriendField.css( 'color', buttonTextColor );
	}

	// Add a Global Friend
	$addGlobalFriendButton.click( function(e) {
		var $self = $(this);
		var $parentTable = $('.wp-list-table'); // TODO: way too general
		var nonce = $('#s8d_bpaf_nonce').val();
		var params = { 'username':$addGlobalFriendField.val(), 'nonce':nonce };

		// Send the contents of the existing post
		$.ajax({
			url: ajaxurl + '?action=bpaf_add_global_friend',
			type: 'POST',
			data: jQuery.param(params),
			beforeSend: function() {
				$('.spinner').show();
			},
			complete: function() {
				//$('.spinner').hide();
			},
			success: function(result) {
				$('.spinner').hide();
				// Return the excerpt from the editor
				$('.bpaf-empty-table-row').remove();
				$parentTable.append(result);
			}
		});
	});

	// Remove a Global Friend
	$('#global-friends-form').on( 'click', '.trash', function(e) {

		e.preventDefault();

		var confirmDelete = confirm("Removing this user will delete ALL friendships related the this user. 'Cancel' to stop, 'OK' to delete.");
		if( false === confirmDelete )
			return;

		var $self = $(this);
		var $parentTable = $('.wp-list-table'); // TODO: way too general
		var $parentTableRow = $self.parents('tr');
		var userID = $parentTableRow.find('.bpaf-user-id').val();
		var nonce = $('#s8d_bpaf_nonce').val();

		var params = { 'ID':userID, 'nonce':nonce };

		$.ajax({
			url: ajaxurl + '?action=bpaf_delete_global_friend',
			type: 'POST',
			data: jQuery.param(params),
			beforeSend: function() {
				$('.spinner').show();
			},
			complete: function() {
				//$('.spinner').hide();
			},
			success: function( response ) {
				$('.spinner').hide();
				$parentTableRow.remove();
				if ( 1 >= response ) {
					$parentTable.append('<tr class="bpaf-empty-table-row"><td colspan="3">No Global Friends found.</td></tr>');
				}
			}
		});
	});

});