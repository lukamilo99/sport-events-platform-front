<template>
  <div v-if="showMap" class="modal d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="map-container">
          <l-map :zoom="13" :center="initialLocation" @ready="handleMapReady">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
            <l-marker :lat-lng="markerLocation"></l-marker>
          </l-map>
        </div>
        <div class="modal-footer">
          <button v-if="mode === 'create'" @click.prevent="submitLocation" class="btn btn-primary">Submit location</button>
          <button v-else-if="mode === 'view'" @click.prevent="toggleMap" class="btn btn-danger">Exit map</button>
        </div>
      </div>
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

<style scoped>
.modal-content::before {
  content: "";
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.map-container {
  height: 400px;
  overflow: hidden;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050;
}

.modal-footer {
  display: flex;
  justify-content: center;
}
</style>

