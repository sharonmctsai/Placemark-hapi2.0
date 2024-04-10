import { db } from "./models/db.js";


export async function calculateTotalPlacemarks(placemarks) {
    if (!placemarks || placemarks.length === 0) {
        return 0;
    }
    return placemarks.length;
}


export async function calculateMostPopularCategory(placemarks) {
    if (!placemarks || placemarks.length === 0) {
        return 0;
    }
    const categoryCounts = placemarks.reduce((counts, placemark) => {
        // eslint-disable-next-line prefer-destructuring
        const category = placemark.category;
        counts[category] = (counts[category] || []) + 1;
        return counts;
    }, {});
    let mostPopularCategory = null;
    let maxCount = 0;
    Object.keys(categoryCounts).forEach(category => {
        if (categoryCounts[category] > maxCount) {
            mostPopularCategory = category;
            maxCount = categoryCounts[category];
        }
    });
    return mostPopularCategory;
}


export async function calculatePlacemarksPerCategory(placemarks) {
    if (!placemarks || placemarks.length === 0) {
        return [];
    }
    const categoryCounts = placemarks.reduce((counts, placemark) => {
        // eslint-disable-next-line prefer-destructuring
        const category = placemark.category;
        counts[category] = (counts[category] || 0) + 1;
        return counts;
    }, {});

    const placemarksPerCategory = Object.keys(categoryCounts).map(category => ({
        category: category,
        count: categoryCounts[category]
    }));

    return placemarksPerCategory;
}

export async function calculateMostActiveUser(users) {
    if (!users || users.length === 0) {
        return 0;
    }
    const placemarksPromises = users.map(user => db.placemarkStore.getPlacemarksByUserId(user._id));
    const placemarksArrays = await Promise.all(placemarksPromises);

    const placemarksCounts = placemarksArrays.map((placemarks, index) => ({
        userId: users[index]._id,
        placemarksCount: placemarks.length
    }));

    const mostActiveUser = placemarksCounts.reduce((mostActive, current) => {
        if (current.placemarksCount > mostActive.placemarksCount) {
            return current; 
        } 
        return mostActive; 
    }, placemarksCounts[0]);

    const foundUser = users.find(user => user._id === mostActiveUser.userId);
    const userName = `${foundUser.firstName} ${foundUser.lastName}`;
    return userName;
}
