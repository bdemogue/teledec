import { defineStore } from 'pinia'
import { RealEstate } from '@/types';
import { ref } from 'vue';

export const useRealEstateStore = defineStore('realEstate', () => {
  const list = ref([] as RealEstate[]);
  const loading = ref(false);

  async function fetchList() {
    loading.value = true;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/real-estates`);

      const data = await response.json();

      list.value = data;

    } catch (error) {
      console.log(error);
    }
    loading.value = false;
  }

  async function deleteItem(id: number) {
    loading.value = true;
    try {
         await fetch(`${import.meta.env.VITE_API_BASE_URL}/real-estates/${id}`, {
            method: 'DELETE'
        });
         fetchList();
    } catch (error) {
        console.log(error);
    }
  }

  async function createItem(realEstate: RealEstate) {
    loading.value = true;
    try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/real-estates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(realEstate)
        });

        fetchList();
    } catch (error) {
        console.log(error);
    }
  }

  async function updateItem(realEstate: RealEstate) {
    loading.value = true;
    try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/real-estates/${realEstate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(realEstate)
        });

        fetchList();

    } catch (error) {
        console.log(error);
    }
  }

  return {
    list,
    loading,
    fetchList,
    deleteItem,
    createItem,
    updateItem,
  }
})
