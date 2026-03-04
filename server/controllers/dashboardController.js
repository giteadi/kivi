const Dashboard = require('../models/Dashboard');

class DashboardController {
  constructor() {
    this.dashboardModel = new Dashboard();
  }

  // Get dashboard statistics
  async getStats(req, res) {
    try {
      const { startDate, endDate, clinicId, doctorId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (clinicId) filters.clinicId = parseInt(clinicId);
      if (doctorId) filters.doctorId = parseInt(doctorId);

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

  // Get upcoming appointments
  async getUpcomingAppointments(req, res) {
    try {
      const { limit = 5, clinicId, doctorId } = req.query;

      const filters = {};
      if (clinicId) filters.clinicId = parseInt(clinicId);
      if (doctorId) filters.doctorId = parseInt(doctorId);

      const appointments = await this.dashboardModel.getUpcomingAppointments(
        parseInt(limit), 
        filters
      );

      res.json({
        success: true,
        data: appointments
      });

    } catch (error) {
      console.error('Get upcoming appointments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get top doctors
  async getTopDoctors(req, res) {
    try {
      const { limit = 5, startDate, endDate, clinicId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (clinicId) filters.clinicId = parseInt(clinicId);

      const doctors = await this.dashboardModel.getTopDoctors(
        parseInt(limit), 
        filters
      );

      res.json({
        success: true,
        data: doctors
      });

    } catch (error) {
      console.error('Get top doctors error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get booking status chart data
  async getBookingStatusChart(req, res) {
    try {
      const { startDate, endDate, clinicId, doctorId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (clinicId) filters.clinicId = parseInt(clinicId);
      if (doctorId) filters.doctorId = parseInt(doctorId);

      const chartData = await this.dashboardModel.getBookingStatusChart(filters);

      res.json({
        success: true,
        data: chartData
      });

    } catch (error) {
      console.error('Get booking status chart error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get complete dashboard data
  async getDashboardData(req, res) {
    try {
      const { startDate, endDate, clinicId, doctorId } = req.query;

      const filters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (clinicId) filters.clinicId = parseInt(clinicId);
      if (doctorId) filters.doctorId = parseInt(doctorId);

      // Get all dashboard data in parallel
      const [stats, upcomingAppointments, topDoctors, bookingChart] = await Promise.all([
        this.dashboardModel.getDashboardStats(filters),
        this.dashboardModel.getUpcomingAppointments(5, filters),
        this.dashboardModel.getTopDoctors(5, filters),
        this.dashboardModel.getBookingStatusChart(filters)
      ]);

      res.json({
        success: true,
        data: {
          stats,
          upcomingAppointments,
          topDoctors,
          bookingChart
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