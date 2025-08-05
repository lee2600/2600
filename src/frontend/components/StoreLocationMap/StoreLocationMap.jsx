import React, { useState, useEffect } from 'react';
import styles from './StoreLocationMap.module.css';

const StoreLocationMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [travelTimes, setTravelTimes] = useState({
    walking: null,
    cycling: null,
    electricBike: null,
    driving: null
  });

  // COORDENADAS ACTUALIZADAS DE LA TIENDA - Reparto Nuevo Vista Alegre
  const storeLocation = {
    lat: 20.039585,
    lng: -75.849663,
    address: "Reparto Nuevo Vista Alegre, Santiago de Cuba",
    name: "Yero Shop!",
    fullAddress: "Reparto Nuevo Vista Alegre, Santiago de Cuba, Cuba"
  };

  // Función para calcular distancia entre dos puntos (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // FUNCIÓN MEJORADA PARA CALCULAR TIEMPOS DE VIAJE SEGÚN MEDIO DE TRANSPORTE
  const calculateTravelTimes = (distanceKm) => {
    // Velocidades promedio en km/h para Santiago de Cuba
    const speeds = {
      walking: 4.5,        // Caminando en ciudad
      cycling: 12,         // Bicicleta de pedales en ciudad
      electricBike: 20,    // Bicicleta eléctrica en ciudad
      driving: 25          // Automóvil en ciudad (considerando tráfico urbano)
    };

    const times = {};
    Object.keys(speeds).forEach(method => {
      const timeHours = distanceKm / speeds[method];
      const timeMinutes = Math.ceil(timeHours * 60);
      times[method] = timeMinutes;
    });

    return times;
  };

  // FUNCIÓN PARA FORMATEAR TIEMPO DE VIAJE CON EMOJIS
  const formatTravelTime = (minutes, method) => {
    const icons = {
      walking: '🚶‍♂️',
      cycling: '🚴‍♂️',
      electricBike: '🚴‍♂️⚡',
      driving: '🚗'
    };

    const labels = {
      walking: 'Caminando',
      cycling: 'Bicicleta',
      electricBike: 'Bici Eléctrica',
      driving: 'Automóvil'
    };

    if (minutes < 60) {
      return `${icons[method]} ${labels[method]}: ${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${icons[method]} ${labels[method]}: ${hours}h ${remainingMinutes}min`;
    }
  };

  // Obtener ubicación del usuario
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      alert('La geolocalización no es compatible con este navegador');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        setUserLocation({ lat: userLat, lng: userLng });
        
        // Calcular distancia
        const dist = calculateDistance(
          userLat, 
          userLng, 
          storeLocation.lat, 
          storeLocation.lng
        );
        
        setDistance(dist);
        
        // Calcular tiempos de viaje para diferentes medios de transporte
        const times = calculateTravelTimes(dist);
        setTravelTimes(times);
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('No se pudo obtener tu ubicación. Por favor permite el acceso a la ubicación.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // URLs para diferentes aplicaciones de mapas CON COORDENADAS ACTUALIZADAS
  const getDirectionsUrls = () => {
    const storeCoords = `${storeLocation.lat},${storeLocation.lng}`;
    const userCoords = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    
    return {
      googleMaps: userLocation 
        ? `https://www.google.com/maps/dir/${userCoords}/${storeCoords}`
        : `https://www.google.com/maps/place/20%C2%B002'22.5%22N+75%C2%B050'58.8%22W/@20.0394604,-75.8495414,180m/data=!3m1!1e3!4m4!3m3!8m2!3d20.039585!4d-75.849663?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D`,
      appleMaps: userLocation
        ? `http://maps.apple.com/?saddr=${userCoords}&daddr=${storeCoords}`
        : `http://maps.apple.com/?q=${storeCoords}`,
      waze: userLocation
        ? `https://waze.com/ul?ll=${storeLocation.lat},${storeLocation.lng}&navigate=yes`
        : `https://waze.com/ul?ll=${storeLocation.lat},${storeLocation.lng}`,
    };
  };

  const directionsUrls = getDirectionsUrls();

  return (
    <div className={styles.storeLocationMap}>
      {/* Mapa embebido de Google Maps CON COORDENADAS ACTUALIZADAS */}
      <div className={styles.mapContainer}>
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.8!2d${storeLocation.lng}!3d${storeLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent('20°02\'22.5"N 75°50\'58.8"W')}!5e0!3m2!1ses!2scu!4v1640000000000!5m2!1ses!2scu&zoom=18`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Yero Shop! - Reparto Nuevo Vista Alegre"
        ></iframe>
      </div>

      {/* Información de la tienda ACTUALIZADA */}
      <div className={styles.storeInfo}>
        <h4>🏪 {storeLocation.name}</h4>
        <p>📍 {storeLocation.fullAddress}</p>
        <p>📞 WhatsApp: +53 54690878</p>
        <div className={styles.coordinates}>
          <p>🗺️ Coordenadas: {storeLocation.lat}, {storeLocation.lng}</p>
        </div>
        
        {distance && (
          <div className={styles.distanceInfo}>
            <p className={styles.distance}>
              📏 Distancia: <strong>{distance.toFixed(2)} km</strong>
            </p>
            
            {/* TIEMPOS DE VIAJE MEJORADOS POR MEDIO DE TRANSPORTE */}
            <div className={styles.travelTimesContainer}>
              <h5>⏱️ Tiempos de viaje estimados:</h5>
              <div className={styles.travelTimesList}>
                {Object.keys(travelTimes).map(method => (
                  travelTimes[method] && (
                    <div key={method} className={styles.travelTimeItem}>
                      <span>{formatTravelTime(travelTimes[method], method)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className={styles.actionButtons}>
        <button
          onClick={getUserLocation}
          disabled={isLoadingLocation}
          className={`btn btn-primary ${styles.locationBtn}`}
        >
          {isLoadingLocation ? (
            <span className={styles.loading}>
              <span className="loader-2"></span>
              Obteniendo ubicación...
            </span>
          ) : (
            '📍 Calcular Distancia y Tiempos'
          )}
        </button>

        <div className={styles.directionsButtons}>
          <a
            href={directionsUrls.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-success ${styles.directionsBtn}`}
          >
            🗺️ Google Maps
          </a>
          
          <a
            href={directionsUrls.appleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-success ${styles.directionsBtn}`}
          >
            🍎 Apple Maps
          </a>
          
          <a
            href={directionsUrls.waze}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-success ${styles.directionsBtn}`}
          >
            🚗 Waze
          </a>
        </div>
      </div>

      {/* Instrucciones adicionales ACTUALIZADAS */}
      <div className={styles.instructions}>
        <h5>📋 Instrucciones para llegar:</h5>
        <ul>
          <li>🗺️ <strong>Ubicación exacta:</strong> Reparto Nuevo Vista Alegre, Santiago de Cuba</li>
          <li>📍 <strong>Coordenadas GPS:</strong> 20.039585, -75.849663</li>
          <li>🚗 Puedes usar cualquier aplicación de mapas con las coordenadas</li>
          <li>📞 Llama al +53 54690878 si necesitas ayuda para llegar</li>
          <li>🕒 Horario de atención: Lunes a Domingo</li>
          <li>🅿️ Estacionamiento disponible en la zona</li>
          <li>🚌 Acceso por transporte público disponible</li>
        </ul>
      </div>
    </div>
  );
};

export default StoreLocationMap;