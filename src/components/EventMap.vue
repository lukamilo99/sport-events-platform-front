<template>
  <div v-if="showMap" class="map-modal-overlay" @click="toggleMap">
    <div class="map-modal" @click.stop>
      <div class="map-container">
        <l-map :zoom="13" :center="initialLocation" @ready="handleMapReady">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
          <l-marker :lat-lng="markerLocation"></l-marker>
        </l-map>
      </div>
      <button v-if="mode === 'create'" @click.prevent="submitLocation">Submit location</button>
      <button v-else-if="mode === 'view'" @click.prevent="toggleMap">Exit map</button>
    </div>
  </div>
</template>

<script>
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker
  },
  props: {
    initialLocation: {
      type: Array,
      required: true
    },
    markerLocation: {
      type: Array,
      required: true
    },
    showMap: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      default: 'view'
    }
  },
  emits: ['update:showMap', 'update-marker-location', 'submit-location'],
  setup(props, { emit }) {
    const handleMapReady = (mapInstance) => {
      mapInstance.on('click', function(e) {
        emit('update-marker-location', [e.latlng.lat, e.latlng.lng]);
      });
    };

    const toggleMap = () => {
      emit('update:showMap', false);
    };

    const submitLocation = () => {
      emit('submit-location');
    };

    return {
      handleMapReady,
      toggleMap,
      submitLocation
    };
  }
};
</script>

<style>
.map-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.map-modal {
  width: 70%;
  height: 60%;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.map-container {
  height: calc(100% - 70px);
  width: 100%;
  overflow: hidden;
  flex: 1;
}

button {
  padding: 10px 20px;
}

</style>
