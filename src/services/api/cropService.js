import { getApperClient } from "@/services/apperClient";

const cropService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('crops_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error("Error fetching crops:", response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(crop => ({
        Id: crop.Id,
        cropType: crop.cropType_c,
        fieldLocation: crop.fieldLocation_c,
        plantingDate: crop.plantingDate_c,
        expectedHarvestDate: crop.expectedHarvestDate_c,
        status: crop.status_c,
        notes: crop.notes_c,
        farmId: crop.farmId_c?.Id?.toString() || "",
        createdAt: crop.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
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

      const response = await apperClient.getRecordById('crops_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success || !response.data) {
        console.error("Error fetching crop:", response.message);
        return null;
      }

      // Transform database fields to match UI expectations
      const crop = response.data;
      return {
        Id: crop.Id,
        cropType: crop.cropType_c,
        fieldLocation: crop.fieldLocation_c,
        plantingDate: crop.plantingDate_c,
        expectedHarvestDate: crop.expectedHarvestDate_c,
        status: crop.status_c,
        notes: crop.notes_c,
        farmId: crop.farmId_c?.Id?.toString() || "",
        createdAt: crop.CreatedOn
      };
    } catch (error) {
      console.error("Error fetching crop:", error?.response?.data?.message || error);
      return null;
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return [];
      }

      const response = await apperClient.fetchRecords('crops_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "cropType_c"}},
          {"field": {"Name": "fieldLocation_c"}},
          {"field": {"Name": "plantingDate_c"}},
          {"field": {"Name": "expectedHarvestDate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farmId_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "farmId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error("Error fetching crops by farm:", response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(crop => ({
        Id: crop.Id,
        cropType: crop.cropType_c,
        fieldLocation: crop.fieldLocation_c,
        plantingDate: crop.plantingDate_c,
        expectedHarvestDate: crop.expectedHarvestDate_c,
        status: crop.status_c,
        notes: crop.notes_c,
        farmId: crop.farmId_c?.Id?.toString() || "",
        createdAt: crop.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching crops by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.createRecord('crops_c', {
        records: [{
          Name: cropData.cropType || "",
          cropType_c: cropData.cropType || "",
          fieldLocation_c: cropData.fieldLocation || "",
          plantingDate_c: cropData.plantingDate || "",
          expectedHarvestDate_c: cropData.expectedHarvestDate || "",
          status_c: cropData.status || "Planted",
          notes_c: cropData.notes || "",
          farmId_c: parseInt(cropData.farmId) || null
        }]
      });

      if (!response.success) {
        console.error("Error creating crop:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:`, failed);
        }
        
        if (successful.length > 0) {
          const crop = successful[0].data;
          return {
            Id: crop.Id,
            cropType: crop.cropType_c,
            fieldLocation: crop.fieldLocation_c,
            plantingDate: crop.plantingDate_c,
            expectedHarvestDate: crop.expectedHarvestDate_c,
            status: crop.status_c,
            notes: crop.notes_c,
            farmId: crop.farmId_c?.Id?.toString() || "",
            createdAt: crop.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not available");
        return null;
      }

      const response = await apperClient.updateRecord('crops_c', {
        records: [{
          Id: parseInt(id),
          Name: cropData.cropType || "",
          cropType_c: cropData.cropType || "",
          fieldLocation_c: cropData.fieldLocation || "",
          plantingDate_c: cropData.plantingDate || "",
          expectedHarvestDate_c: cropData.expectedHarvestDate || "",
          status_c: cropData.status || "Planted",
          notes_c: cropData.notes || "",
          farmId_c: parseInt(cropData.farmId) || null
        }]
      });

      if (!response.success) {
        console.error("Error updating crop:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:`, failed);
        }
        
        if (successful.length > 0) {
          const crop = successful[0].data;
          return {
            Id: crop.Id,
            cropType: crop.cropType_c,
            fieldLocation: crop.fieldLocation_c,
            plantingDate: crop.plantingDate_c,
            expectedHarvestDate: crop.expectedHarvestDate_c,
            status: crop.status_c,
            notes: crop.notes_c,
            farmId: crop.farmId_c?.Id?.toString() || "",
            createdAt: crop.CreatedOn
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('crops_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error("Error deleting crop:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} crops:`, failed);
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default cropService;