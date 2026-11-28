<script lang="ts">
  import AtlContainer from "@atlas/AtlContainer.svelte";
  let { content = "Conteúdo do container", ...rest } = $props();
</script>

<AtlContainer {...rest}>{content}</AtlContainer>
