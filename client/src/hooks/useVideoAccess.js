import { useAuth } from '../context/AuthContext';

export const useVideoAccess = () => {
  const { user } = useAuth();

  const tierHierarchy = {
    'basic': 1,
    'premium': 2,
    'pro': 3
  };

  const getUserTier = () => {
    if (!user?.currentSubscription?.plan) return 'basic';
    return user.currentSubscription.plan.name.toLowerCase();
  };

  const canAccessVideo = (videoTier) => {
    const userTier = getUserTier();
    const userLevel = tierHierarchy[userTier] || 1;
    const videoLevel = tierHierarchy[videoTier] || 1;
    
    return userLevel >= videoLevel;
  };

  const getAvailableQualities = () => {
    const userTier = getUserTier();
    const qualityMap = {
      'basic': ['360p', '480p'],
      'premium': ['360p', '480p', '720p', '1080p'],
      'pro': ['360p', '480p', '720p', '1080p', '4K']
    };
    return qualityMap[userTier] || qualityMap.basic;
  };

  const getBadgeColor = (tier) => {
    switch(tier) {
      case 'basic': return 'bg-gray-500';
      case 'premium': return 'bg-purple-500';
      case 'pro': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierLabel = (tier) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return {
    getUserTier,
    canAccessVideo,
    getAvailableQualities,
    getBadgeColor,
    getTierLabel,
    isAuthenticated: !!user
  };
};
