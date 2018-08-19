<template>
    <li class="mdl-list__item mdl-list__item--two-line">
        <span class="mdl-list__item-primary-content">
            <img v-if="data.image" :src="data.image" class="mdl-list__item-avatar">
            <i v-else class="material-icons mdl-list__item-avatar">person</i>
            
            <span>{{ data.title }}</span>
            <span class="mdl-list__item-sub-title">{{ data.description }}</span>
        </span>
        <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#" @click.prevent="$emit('edit-todo')"><i class="material-icons">edit</i></a>
        </span>
        <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#" @click.prevent="$emit('delete-todo')"><i class="material-icons">delete</i></a>
        </span>
    </li>
</template>

<script>
export default {
  props: ['data'],
};
</script>
