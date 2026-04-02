<!-- ContractPDF.vue -->
<template>
  <div>
    <button
      @click="generateContract"
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
      title="Generate Contract"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
      </svg>
    </button>
    <!-- Development mode controls -->
    <div v-if="devMode" class="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Position Adjustment</h3>
        <div class="space-y-2">
          <div>
            <label class="block text-sm">Field:</label>
            <select v-model="selectedField" class="form-select mt-1 block w-full dark:bg-transparent bg-white dark:text-white">
              <option value="date">Date</option>
              <option value="fullName">Full Name</option>
              <option value="nationality">Nationality</option>
              <option value="birthDate">Birth Date</option>
              <option value="profession">Profession</option>
              <option value="cin">CIN</option>
              <option value="license">License</option>
              <option value="licenseDate">License Date</option>
              <option value="address">Address</option>
              <option value="phone">Phone</option>
              <option value="carName">Car Name</option>
              <option value="licensePlate">License Plate</option>
              <option value="fuelType">Fuel Type</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
              <option value="days">Days</option>
              <option value="startTime">Start Time</option>
              <option value="advance">Advance</option>
              <option value="total">Total</option>
              <option value="remaining">Remaining</option>
            </select>
          </div>
          <div class="flex space-x-2">
            <div>
              <label class="block text-sm">X:</label>
              <input type="number" v-model="positions[selectedField].x" class="form-input mt-1 block w-full dark:bg-transparent bg-white dark:text-white" step="1" />
            </div>
            <div>
              <label class="block text-sm">Y:</label>
              <input type="number" v-model="positions[selectedField].y" class="form-input mt-1 block w-full dark:bg-transparent bg-white dark:text-white" step="1" />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <button @click="generateContract" class="bg-blue-500 text-white px-4 py-2 rounded">
          Test Position
        </button>
        <button @click="copyPositions" class="bg-green-500 text-white px-4 py-2 rounded">
          Copy Coordinates
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf';

export default {
  name: 'ContractPDF',
  props: {
    reservation: {
      type: Object,
      required: true
    },
    car: {
      type: Object,
      required: true
    },
    client: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      devMode: false, // Set to true to show position adjustment tools
      selectedField: 'date',
      positions: {
        date: { x: 110, y: 36 },
        fullName: { x: 42, y: 73 },
        nationality: { x: 42, y: 80 },
        birthDate: { x: 48, y: 85 },
        profession: { x: 42, y: 91 },
        cin: { x: 38, y: 99 },
        license: { x: 53, y: 105 },
        licenseDate: { x: 38, y: 111 },
        address: { x: 28, y: 124 },
        phone: { x: 28, y: 131 },
        // Second driver positions
        secondDriverFullName: { x: 42, y: 157 },
        secondDriverLicense: { x: 53, y: 164 },
        secondDriverLicenseDate: { x: 32, y: 170 },
        secondDriverLicenseCity: { x: 62, y: 170 },
        secondDriverCin: { x: 28, y: 183 },
        secondDriverCinDate: { x: 62, y: 183 },
        // Car and payment info
        carName: { x: 165, y: 62 },
        licensePlate: { x: 165, y: 72 },
        fuelType: { x: 165, y: 83 },
        startDate: { x: 165, y: 93 },
        endDate: { x: 165, y: 103 },
        days: { x: 165, y: 115 },
        startTime: { x: 165, y: 125 },
        advance: { x: 165, y: 135 },
        total: { x: 165, y: 145 },
        remaining: { x: 165, y: 156 }
      }
    };
  },
  methods: {
    async generateContract() {
      try {
        console.log('Client data received:', this.client);
        console.log('Car data received:', this.car);
        console.log('Reservation data received:', this.reservation);

        // Format client data for better debugging
        const clientInfo = {
          fullName: this.client.name || '',
          nationality: this.client.nationality || '',
          birthDate: this.formatDate(this.client.birthDate) || '',
          profession: this.client.profession || '',
          cin: this.client.cin || '',
          licenseNumber: this.client.licenseNumber || '',
          licenseDate: this.formatDate(this.client.licenseDate) || '',
          address: this.client.address || '',
          phone: this.client.phone || ''
        };

        console.log('Formatted client info for PDF:', clientInfo);

        const doc = new jsPDF('p', 'mm', 'a4');
        
        const img = new Image();
        img.src = '/contract-template.jpg';
        doc.addImage(img, 'JPEG', 0, 0, 210, 297);

        // Update font settings for better visibility
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        const currentDate = new Date(this.reservation.startDate).toLocaleDateString('fr-FR');
        doc.text(currentDate, this.positions.date.x, this.positions.date.y);

        // Client information with bold font
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);

        // Add client information
        doc.text(clientInfo.fullName, this.positions.fullName.x, this.positions.fullName.y);
        doc.text(clientInfo.nationality, this.positions.nationality.x, this.positions.nationality.y);
        doc.text(clientInfo.birthDate, this.positions.birthDate.x, this.positions.birthDate.y);
        doc.text(clientInfo.profession, this.positions.profession.x, this.positions.profession.y);
        doc.text(clientInfo.cin, this.positions.cin.x, this.positions.cin.y);
        doc.text(clientInfo.licenseNumber, this.positions.license.x, this.positions.license.y);
        doc.text(clientInfo.licenseDate, this.positions.licenseDate.x, this.positions.licenseDate.y);
        doc.text(clientInfo.address, this.positions.address.x, this.positions.address.y);
        doc.text(clientInfo.phone, this.positions.phone.x, this.positions.phone.y);

        // Add second driver information if exists
        if (this.reservation.hasSecondDriver) {
          const secondDriver = this.reservation.secondDriver;
          doc.text(`${secondDriver.firstName} ${secondDriver.lastName}`, this.positions.secondDriverFullName.x, this.positions.secondDriverFullName.y);
          doc.text(secondDriver.license, this.positions.secondDriverLicense.x, this.positions.secondDriverLicense.y);
          doc.text(this.formatDate(secondDriver.licenseDate), this.positions.secondDriverLicenseDate.x, this.positions.secondDriverLicenseDate.y);
          doc.text(secondDriver.licenseCity, this.positions.secondDriverLicenseCity.x, this.positions.secondDriverLicenseCity.y);
          doc.text(secondDriver.cin, this.positions.secondDriverCin.x, this.positions.secondDriverCin.y);
          doc.text(this.formatDate(secondDriver.cinDeliveredAt), this.positions.secondDriverCinDate.x, this.positions.secondDriverCinDate.y);
        }

        // Car information with larger bold font
        doc.setFontSize(12);
        const carInfo = {
          name: this.car.name || '',
          licensePlate: this.car.licensePlate || '',
          fuelType: 'DIESEL'
        };

        doc.text(carInfo.name, this.positions.carName.x, this.positions.carName.y);
        doc.text(carInfo.licensePlate, this.positions.licensePlate.x, this.positions.licensePlate.y);
        // doc.text(carInfo.fuelType, this.positions.fuelType.x, this.positions.fuelType.y);

        // Reservation dates with bold font
        const reservationInfo = {
          startDate: this.formatDate(this.reservation.startDate),
          endDate: this.formatDate(this.reservation.endDate),
          days: this.calculateDays().toString(),
          startTime: this.reservation.startTime || '0',
          advance: this.reservation.advance?.toString() || '0',
          totalPrice: this.reservation.totalPrice?.toString() || '0',
          remaining: ((this.reservation.totalPrice || 0) - (this.reservation.advance || 0)).toString()
        };

        doc.text(reservationInfo.startDate, this.positions.startDate.x, this.positions.startDate.y);
        doc.text(reservationInfo.endDate, this.positions.endDate.x, this.positions.endDate.y);
        doc.text(reservationInfo.days, this.positions.days.x, this.positions.days.y);
        doc.text(reservationInfo.startTime, this.positions.startTime.x, this.positions.startTime.y);

        // Monetary values with larger bold font
        doc.setFontSize(13);
        doc.text(reservationInfo.advance, this.positions.advance.x, this.positions.advance.y);
        doc.text(reservationInfo.totalPrice, this.positions.total.x, this.positions.total.y);
        doc.text(reservationInfo.remaining, this.positions.remaining.x, this.positions.remaining.y);

        // Add total price
        // doc.setFontSize(12);
        // doc.text(`Total Price: ${this.reservation.totalPrice} MAD`, 20, 200);
        
        // // Add advance information
        // doc.text(`Advance: ${this.reservation.advance} MAD`, 20, 210);
        // doc.text(`Remaining: ${this.reservation.totalPrice - this.reservation.advance} MAD`, 20, 220);

        doc.save(`contrat-location-${clientInfo.fullName}-${currentDate}.pdf`);
      } catch (error) {
        console.error('Error generating contract:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        // First, try parsing as ISO format (YYYY-MM-DD)
        let date = new Date(dateString);
        
        // If invalid, try parsing as DD/MM/YYYY
        if (isNaN(date.getTime()) && dateString.includes('/')) {
          const [day, month, year] = dateString.split('/');
          date = new Date(year, month - 1, day);
        }
        
        // If still invalid, log warning and return empty string
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateString);
          return dateString; // Return original string if we can't parse it
        }
        
        // Format date as DD/MM/YYYY
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch (error) {
        console.error('Error formatting date:', error, dateString);
        return dateString; // Return original string if there's an error
      }
    },
    calculateDays() {
      if (this.reservation.startDate && this.reservation.endDate) {
        const start = new Date(this.reservation.startDate);
        const end = new Date(this.reservation.endDate);
        const diffTime = Math.abs(end - start);
        // Add 1 to include both start and end dates
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      }
      return 0;
    },
    copyPositions() {
      const positionsText = JSON.stringify(this.positions, null, 2);
      navigator.clipboard.writeText(positionsText);
      alert('Positions copied to clipboard!');
    }
  }
};
</script> 