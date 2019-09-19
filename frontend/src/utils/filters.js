import { difference } from 'lodash-es';

const isEmpty = value => {
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    if (isNaN(value)) {
        return !value || !value.length;
    }

    return false;
};

const contains = (value, answer) => {
    if (!value || !answer) return false;
    if (Array.isArray(answer)) {
        return answer.indexOf(value) !== -1;
    } else if (typeof answer === 'string') {
        return answer
            .toLowerCase()
            .trim()
            .indexOf(value.toLowerCase().trim());
    }
    return false;
};

const equals = (value, answer) => {
    if (!value || !answer) return false;
    if (typeof answer === 'string') {
        return value.toLowerCase().trim() === answer.toLowerCase().trim();
    }

    return answer === value;
};

const filter = (registration, filter) => {
    switch (filter.type) {
        case 'status-equals': {
            return filter.value && filter.value.indexOf(registration.status) !== -1;
        }
        case 'status-nequals': {
            return !filter.value || filter.value.indexOf(registration.status) === -1;
        }
        case 'rating-exists': {
            return registration.rating && registration.rating > 0;
        }
        case 'rating-nexists': {
            return !registration.rating;
        }
        case 'rating-lte': {
            return registration.rating && registration.rating <= filter.value;
        }
        case 'rating-gte': {
            return registration.rating && registration.rating >= filter.value;
        }
        case 'has-tags': {
            return registration.tags && registration.tags.length > 0;
        }
        case 'tags-contain': {
            return (
                filter.value &&
                registration.tags &&
                difference(filter.value, registration.tags).length !== filter.value.length
            );
        }
        case 'tags-not-contain': {
            return (
                !filter.value ||
                !registration.tags ||
                difference(filter.value, registration.tags).length === filter.value.length
            );
        }
        case 'field-equals': {
            return equals(filter.value, registration.answers[filter.field]);
        }
        case 'field-nequals': {
            return !equals(filter.value, registration.answers[filter.field]);
        }
        case 'field-contains': {
            return contains(filter.value, registration.answers[filter.field]);
        }
        case 'field-not-contains': {
            return !contains(filter.value, registration.answers[filter.field]);
        }
        case 'field-empty': {
            return isEmpty(registration.answers[filter.field]);
        }
        case 'field-not-empty': {
            return !isEmpty(registration.answers[filter.field]);
        }
        default:
            return true;
    }
};

export const applyFilters = (data, filters) => {
    try {
        return data.filter(registration => {
            const filtersLen = filters.length;
            for (let i = 0; i < filtersLen; i++) {
                if (!filter(registration, filters[i])) {
                    return false;
                }
            }
            return true;
        });
    } catch (err) {
        window.alert('Something went wrong! Please try another filter');
        console.log(err);
        return [];
    }
};