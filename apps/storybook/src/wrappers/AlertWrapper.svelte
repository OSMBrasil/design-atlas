<script lang="ts">
  import AtlAlert from "@atlas/AtlAlert.svelte";
  let { message = "Mensagem do alerta", ...rest } = $props();
</script>

<AtlAlert {...rest}>{message}</AtlAlert>
