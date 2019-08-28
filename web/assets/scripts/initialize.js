BoxPlaySocket.initialize();

document.addEventListener('DOMContentLoaded', function() {
    i18n.initialize();
	BoxPlayWeb.initialize();
	BoxPlayWebConnectPanel.initialize();
	BoxPlayWebSearch.initialize();
	BoxPlaySocket.connect();
	
	refreshGallery();
});