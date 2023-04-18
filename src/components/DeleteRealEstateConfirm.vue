<script setup lang="ts">
import { PropType } from 'vue';
import { useRealEstateStore} from '@/store/real-estate';

const props = defineProps({
    realEstateId: {
        type: Number as PropType<number>,
        required: true,
    },
});
const emit = defineEmits(['onClose']);
const store = useRealEstateStore();
const { deleteItem } = store;

const deleteRealEstate = async () => {
    try {
        await deleteItem(props.realEstateId);
        emit('onClose');
    } catch (error) {
        console.log(error);
    }
}
const closeDialog = () => {
    emit('onClose');
}
</script>
<template>
    <v-card>
        <v-card-title class="text-h5 text-center"
            justify="center">Supprimer un bien</v-card-title>
        <v-card-text>
            Voulez-vous vraiment supprimer ce bien ?
        </v-card-text>
        <v-card-actions class="v-container">
            <v-spacer></v-spacer>
            <v-btn color="secondary"
                   variant="text"
                   @click="closeDialog">
                Annuler
            </v-btn>
            <v-btn color="error"
                   variant="text"
                   data-testid="delete-real-estate"
                   @click="deleteRealEstate">
                Supprimer
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
