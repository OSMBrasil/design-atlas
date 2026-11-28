<script lang="ts">
  import AtlButton from "@atlas/AtlButton.svelte";
  let { label = "Button", ...rest } = $props();
</script>

<AtlButton {...rest}>
  {#snippet children()}{label}{/snippet}
</AtlButton>
