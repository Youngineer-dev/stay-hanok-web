/**
 * Naver Maps v3 Integration for Chadam Hanok (차담옥)
 */
(function() {
  const CHADAMOK_COORDS = {
    lat: 37.2821575,
    lng: 127.3545427
  };

  // Naver Maps API authentication failure callback
  window.navermap_authFailure = function () {
    console.error('[Naver Map] Authentication failed: Please verify registered Web Service URL in NCP Console.');
    const mapContainers = document.querySelectorAll('.naver-map-container');
    mapContainers.forEach((container) => {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 420px; background: #fdfbf7; padding: 2rem; text-align: center; color: #5a4f47; box-sizing: border-box;">
          <div style="font-size: 2.2rem; margin-bottom: 0.75rem;">🗺️</div>
          <h4 style="font-family: 'MaruBuri', serif; font-size: 1.15rem; color: #1a1411; margin-bottom: 0.5rem;">네이버 지도 웹 서비스 URL 등록 안내</h4>
          <p style="font-size: 0.85rem; line-height: 1.6; max-width: 420px; margin-bottom: 1.25rem; color: #6d635c;">
            현재 접속 중인 주소(<strong>${window.location.origin}</strong>)가 네이버 클라우드 플랫폼(NCP) 콘솔의 <strong>Web 서비스 URL</strong>에 등록되어야 지도가 정상 표시됩니다.
          </p>
          <div style="background: rgba(201, 169, 122, 0.15); border: 1px dashed #c9a97a; padding: 0.75rem 1.25rem; border-radius: 8px; font-size: 0.8rem; margin-bottom: 1.25rem;">
            등록 권장 URL: <code style="font-weight: 600; color: #1a1411;">${window.location.origin}</code>
          </div>
          <a href="https://map.naver.com/v5/search/${encodeURIComponent('경기 이천시 마장면 마도로248번길 32-101')}" target="_blank" rel="noopener noreferrer" class="btn btn-naver-map" style="font-size: 0.82rem; padding: 0.6rem 1.4rem;">
            네이버 지도에서 바로보기 ↗
          </a>
        </div>
      `;
    });
  };

  function initMap() {
    const mapContainers = document.querySelectorAll('.naver-map-container');
    if (!mapContainers.length) return;

    if (typeof naver === 'undefined' || !naver.maps) {
      console.warn('Naver Maps API script is not loaded or clientId authentication failed.');
      return;
    }

    const chadamokPosition = new naver.maps.LatLng(CHADAMOK_COORDS.lat, CHADAMOK_COORDS.lng);

    mapContainers.forEach((container) => {
      const map = new naver.maps.Map(container, {
        center: chadamokPosition,
        zoom: 16,
        minZoom: 10,
        maxZoom: 19,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT
        },
        scaleControl: true,
        mapDataControl: false
      });

      // Marker
      const marker = new naver.maps.Marker({
        position: chadamokPosition,
        map: map,
        title: '차담옥 (CHADAM HANOK)',
        animation: naver.maps.Animation.DROP
      });

      // Custom Premium InfoWindow Content
      const infoContent = `
        <div class="naver-map-infowindow">
          <div class="info-tag">CHADAM HANOK</div>
          <h4 class="info-title">차담옥 (차담한옥)</h4>
          <p class="info-addr">경기 이천시 마장면 마도로248번길 32-101</p>
          <div class="info-actions">
            <a href="https://map.naver.com/v5/search/${encodeURIComponent('경기 이천시 마장면 마도로248번길 32-101')}" target="_blank" rel="noopener noreferrer" class="info-nav-link">
              네이버 길찾기 ↗
            </a>
          </div>
        </div>
      `;

      const infoWindow = new naver.maps.InfoWindow({
        content: infoContent,
        borderWidth: 0,
        backgroundColor: 'transparent',
        disableAnchor: false,
        pixelOffset: new naver.maps.Point(0, -10)
      });

      infoWindow.open(map, marker);

      // Marker click toggle
      naver.maps.Event.addListener(marker, 'click', function() {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });
    });
  }

  // Auto initialize on DOM ready or window load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }

  window.addEventListener('load', initMap);
})();
