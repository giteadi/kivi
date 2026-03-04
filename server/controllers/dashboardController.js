const Dashboard = require('../models/Dashboard');

class DashboardController {
  constructor() {
    this.dashboardModel = new Dashboard();
  }

  // Get dashboard statistics
  async getStats(req, res) {
    try {
      const { startDate, endDate, centreId, therapistId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (centreId) filters.centreId = parseInt(centreId);
      if (therapistId) filters.therapistId = parseInt(therapistId);

      const stats = await this.dashboardModel.getDashboardStats(filters);

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get upcoming sessions
  async getUpcomingSessions(req, res) {
    try {
      const { limit = 5, centreId, therapistId } = req.query;

      const filters = {};
      if (centreId) filters.centreId = parseInt(centreId);
      if (therapistId) filters.therapistId = parseInt(therapistId);

      const sessions = await this.dashboardModel.getUpcomingSessions(
        parseInt(limit), 
        filters
      );

      res.json({
        success: true,
        data: sessions
      });

    } catch (error) {
      console.error('Get upcoming sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get top therapists
  async getTopTherapists(req, res) {
    try {
      const { limit = 5, startDate, endDate, centreId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (centreId) filters.centreId = parseInt(centreId);

      const therapists = await this.dashboardModel.getTopTherapists(
        parseInt(limit), 
        filters
      );

      res.json({
        success: true,
        data: therapists
      });

    } catch (error) {
      console.error('Get top therapists error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get session status chart data
  async getSessionStatusChart(req, res) {
    try {
      const { startDate, endDate, centreId, therapistId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (centreId) filters.centreId = parseInt(centreId);
      if (therapistId) filters.therapistId = parseInt(therapistId);

      const chartData = await this.dashboardModel.getSessionStatusChart(filters);

      res.json({
        success: true,
        data: chartData
      });

    } catch (error) {
      console.error('Get session status chart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get complete dashboard data
  async getDashboardData(req, res) {
    try {
      const { startDate, endDate, centreId, therapistId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (centreId) filters.centreId = parseInt(centreId);
      if (therapistId) filters.therapistId = parseInt(therapistId);

      // Get all dashboard data in parallel
      const [stats, upcomingSessions, topTherapists, sessionChart] = await Promise.all([
        this.dashboardModel.getDashboardStats(filters),
        this.dashboardModel.getUpcomingSessions(5, filters),
        this.dashboardModel.getTopTherapists(5, filters),
        this.dashboardModel.getSessionStatusChart(filters)
      ]);

      res.json({
        success: true,
        data: {
          stats,
          upcomingSessions,
          topTherapists,
          sessionChart
        }
      });

    } catch (error) {
      console.error('Get dashboard data error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new DashboardController();