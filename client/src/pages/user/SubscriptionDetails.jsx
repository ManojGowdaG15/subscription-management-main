import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { subscriptionAPI } from '../../services/api';
import { format, differenceInDays, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const SubscriptionDetails = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await subscriptionAPI.getCurrent();
      setSubscription(response.data.subscription);
    } catch (error) {
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">No Active Subscription</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You don't have an active subscription. Subscribe to get started!
        </p>
      </div>
    );
  }

  const daysRemaining = differenceInDays(new Date(subscription.endDate), new Date());
  const totalDays = differenceInDays(new Date(subscription.endDate), new Date(subscription.startDate));
  const elapsedDays = differenceInDays(new Date(), new Date(subscription.startDate));
  const progressPercentage = (elapsedDays / totalDays) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Subscription Details</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">View your current subscription information</p>
      </div>

      {/* Main Subscription Card */}
      <div className="card p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">{subscription.plan.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{subscription.plan.description}</p>
            
            <div className="flex items-center space-x-2 mb-6">
              <span className="badge-success">Active</span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plan Price</p>
                <p className="text-xl font-semibold">${subscription.plan.price}/{subscription.plan.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="text-lg font-semibold">{subscription.status}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div className="p-4 bg-primary-50 dark:bg-primary-900 rounded-lg">
                <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 mb-2">
                  <FiClock className="w-5 h-5" />
                  <span className="font-medium">Remaining Time</span>
                </div>
                <p className="text-3xl font-bold">{daysRemaining} days</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                  <FiCalendar className="w-5 h-5" />
                  <span className="font-medium">Renewal Date</span>
                </div>
                <p className="text-lg font-semibold">
                  {format(new Date(subscription.endDate), 'MMMM dd, yyyy')}
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                  <FiCheckCircle className="w-5 h-5" />
                  <span className="font-medium">Auto-Renew</span>
                </div>
                <p className="text-lg font-semibold">
                  {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 pt-8 border-t dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Subscription Progress</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {elapsedDays} of {totalDays} days used
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Plan Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscription.plan.features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Subscription Started</p>
          <p className="text-lg font-semibold">{format(new Date(subscription.startDate), 'MMM dd, yyyy')}</p>
        </div>
        <div className="card p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Payment Status</p>
          <span className="badge-success">{subscription.paymentStatus}</span>
        </div>
        <div className="card p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Duration</p>
          <p className="text-lg font-semibold capitalize">{subscription.plan.duration}</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
