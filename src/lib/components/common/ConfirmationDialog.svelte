<script lang="ts">
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	type AlertDialogProps = {
		open?: boolean;
		title?: string;
		message?: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm?: () => void;
		onCancel?: () => void;
		loading?: boolean;
	};
	let {
		open = false,
		title = 'Are you sure?',
		message = 'This action cannot be undone.',
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		onConfirm = () => {},
		onCancel = () => {},
		loading = false
	}: AlertDialogProps = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Title>{title}</AlertDialog.Title>
		<AlertDialog.Description>{message}</AlertDialog.Description>
		<div class="mt-6 flex justify-end gap-2">
			<AlertDialog.Cancel onclick={onCancel} disabled={loading}>{cancelText}</AlertDialog.Cancel>
			<AlertDialog.Action onclick={onConfirm} disabled={loading}>
				{#if loading}
					<LoadingSpinner size={16} />
				{/if}
				{confirmText}
			</AlertDialog.Action>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>

<style lang="postcss">
	/* Add your custom styles here if needed */
</style>
