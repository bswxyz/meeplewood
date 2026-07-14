<script>
  import '../app.css';
  let { children } = $props();
</script>

<div class="felt" aria-hidden="true"></div>
{@render children()}
