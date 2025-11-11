import { getApperClient } from "@/services/apperClient";

const farmService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('farms_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "sizeUnit_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching farms:", response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.name_c,
        location: farm.location_c,
        size: farm.size_c,
        sizeUnit: farm.sizeUnit_c,
        createdAt: farm.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.getRecordById('farms_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "sizeUnit_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error("Error fetching farm:", response.message);
        return null;
      }

      // Transform database fields to match UI expectations
      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.name_c,
        location: farm.location_c,
        size: farm.size_c,
        sizeUnit: farm.sizeUnit_c,
        createdAt: farm.CreatedOn
      };
    } catch (error) {
      console.error("Error fetching farm:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.createRecord('farms_c', {
        records: [{
          Name: farmData.name || "",
          name_c: farmData.name || "",
          location_c: farmData.location || "",
          size_c: parseFloat(farmData.size) || 0,
          sizeUnit_c: farmData.sizeUnit || "acres"
        }]
      });

      if (!response.success) {
        console.error("Error creating farm:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farms:`, failed);
        }
        
        if (successful.length > 0) {
          const farm = successful[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c,
            location: farm.location_c,
            size: farm.size_c,
            sizeUnit: farm.sizeUnit_c,
            createdAt: farm.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.updateRecord('farms_c', {
        records: [{
          Id: parseInt(id),
          Name: farmData.name || "",
          name_c: farmData.name || "",
          location_c: farmData.location || "",
          size_c: parseFloat(farmData.size) || 0,
          sizeUnit_c: farmData.sizeUnit || "acres"
        }]
      });

      if (!response.success) {
        console.error("Error updating farm:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farms:`, failed);
        }
        
        if (successful.length > 0) {
          const farm = successful[0].data;
          return {
            Id: farm.Id,
            name: farm.name_c,
            location: farm.location_c,
            size: farm.size_c,
            sizeUnit: farm.sizeUnit_c,
            createdAt: farm.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return false;
      }

      const response = await apperClient.deleteRecord('farms_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting farm:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} farms:`, failed);
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default farmService;
export default farmService;