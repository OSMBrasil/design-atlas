<script lang="ts">
  import AtlCheckbox from "@atlas/AtlCheckbox.svelte";
  let { label = "I accept the terms", ...rest } = $props();
</script>

<AtlCheckbox {...rest}>{label}</AtlCheckbox>
