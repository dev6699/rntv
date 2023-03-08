import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Switch, Text, TouchableHighlight, View } from "react-native"

import { Button } from '../components';
import { imgAssets, theme } from '../utils';
import { DownloadList } from '../hooks/useDownload';
import { useDownloadContext, useNavContext, useVideoContext } from '../hooks';

export const LibraryScreen = () => {

    const {
        actions: {
            playOfflineVideo,
        },
    } = useVideoContext();

    const {
        state: {
            storage,
            downloadList,
            downloading,
            progress,
            wifiOnly,
            autoDownload
        },
        actions: {
            startDownload,
            pauseDownload,
            clearStorage,
            deleteDownload,
            checkDownloadExist,
            markDownloadMissing,
            toggleWifiOnly,
            toggleAutoDownload
        }
    } = useDownloadContext()

    const { setPage } = useNavContext()

    const [editMode, setEditMode] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [selectedDelete, setSelectedDelete] = useState<DownloadList>({})
    const selectedCount = Object.keys(selectedDelete).length
    const downloadCount = Object.keys(downloadList).length
    const allSelected = selectedCount === downloadCount

    return (
        <View style={{ marginTop: 20, flex: 1, position: 'relative' }}>
            {deleting &&
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        left: 0,
                        top: 0,
                        zIndex: 99,
                        backgroundColor: theme.whiteA(0.2)
                    }}>
                    <ActivityIndicator size={100} color={theme.primary} />
                </View>
            }

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: theme.whiteA(0.2),
            }}>
                {editMode ?
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>

                        <TouchableHighlight
                            onPress={() => {
                                if (allSelected) {
                                    setSelectedDelete({})
                                } else {
                                    setSelectedDelete(JSON.parse(JSON.stringify(downloadList)))
                                }
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ alignItems: 'center', marginRight: 10 }}>

                                    {allSelected ?
                                        <Image
                                            style={{
                                                height: 24, width: 24,
                                            }}
                                            resizeMode='contain'
                                            source={imgAssets.checked}
                                        />
                                        :
                                        <View
                                            style={{
                                                height: 24, width: 24,
                                                borderWidth: 1,
                                                borderColor: theme.whiteA(0.3),
                                                borderRadius: 999
                                            }}
                                        />
                                    }
                                    <Text style={{
                                        color: theme.whiteA(), fontSize: 10,
                                    }}>
                                        All
                                    </Text>
                                </View>
                                <Text style={{ color: theme.whiteA(), fontSize: 16 }}>
                                    {
                                        selectedCount > 0 ?
                                            selectedCount + ' selected'
                                            :
                                            'Select items'
                                    }
                                </Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={{ marginBottom: 5 }}
                            onPress={() => {
                                setEditMode(false)
                                setSelectedDelete({})
                            }}
                        >
                            <Image
                                style={{ height: 24, width: 24 }}
                                resizeMode='contain'
                                source={imgAssets.close}
                            />
                        </TouchableHighlight>
                    </View>
                    :
                    <View style={{ padding: 5, flex: 1, }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: theme.whiteA(), fontSize: 20 }}>
                                Downloads
                            </Text>

                            {
                                downloadCount > 0 &&
                                <TouchableHighlight
                                    style={{ marginBottom: 5 }}
                                    onPress={() => {
                                        setEditMode(true)
                                    }}
                                >
                                    <Image
                                        style={{ height: 24, width: 24 }}
                                        resizeMode='contain'
                                        source={imgAssets.edit}
                                    />
                                </TouchableHighlight>
                            }
                        </View>

                        <View style={{
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: theme.whiteA(0.7),
                            padding: 10,
                            width: '70%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Text style={{ color: theme.whiteA(0.7) }}>
                                    Wi-Fi Only
                                </Text>
                                <Switch
                                    trackColor={{ false: theme.whiteA(0.3), true: theme.whiteA(0.7) }}
                                    thumbColor={wifiOnly ? theme.primary : theme.whiteA()}
                                    onValueChange={toggleWifiOnly}
                                    value={wifiOnly}
                                />
                            </View>
                            <View
                                style={{
                                    marginTop: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ color: theme.whiteA(0.7) }}>
                                    Auto Download
                                </Text>
                                <Switch
                                    trackColor={{ false: theme.whiteA(0.3), true: theme.whiteA(0.7) }}
                                    thumbColor={autoDownload ? theme.primary : theme.whiteA()}
                                    onValueChange={toggleAutoDownload}
                                    value={autoDownload}
                                />
                            </View>
                        </View>
                    </View>
                }
            </View>

            {
                !downloadCount ?
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            resizeMode='contain'
                            source={imgAssets.nothing}
                        />
                        <Text style={{ color: theme.whiteA(), fontSize: 22, marginVertical: 5 }}>
                            No items found
                        </Text>
                        <Text style={{ color: theme.whiteA(0.8), fontSize: 16, textAlign: 'center' }}>
                            Looks like you haven't download any video yet...!!!
                        </Text>

                        <Button
                            onPress={() => {
                                setPage('home', true)
                            }}
                            touchStyle={{
                                borderRadius: 10,
                                marginTop: 15,
                            }}
                            style={{
                                borderRadius: 10,
                                paddingVertical: 2,
                                paddingHorizontal: 10,
                                backgroundColor: theme.whiteA(0.2),
                                flex: 0
                            }}
                            text='Explore'
                        />
                    </View>
                    :

                    <FlatList
                        data={Object.entries(downloadList)}
                        renderItem={({ item, index }) => {
                            const [_, d] = item
                            const selected = selectedDelete[d.href]
                            return (
                                <TouchableHighlight
                                    key={d.href}
                                    onPress={async () => {
                                        if (editMode) {
                                            if (selected) {
                                                delete selectedDelete[d.href]
                                            } else {
                                                selectedDelete[d.href] = d
                                            }
                                            setSelectedDelete(JSON.parse(JSON.stringify(selectedDelete)))
                                            return
                                        }

                                        if (!d.path) {
                                            return
                                        }
                                        const exist = await checkDownloadExist(d)
                                        if (exist) {
                                            playOfflineVideo(d.path, d.name + " " + d.ep)
                                        } else {
                                            await markDownloadMissing(d)
                                        }
                                    }}
                                >
                                    <View style={{
                                        paddingVertical: 20,
                                        borderBottomColor: theme.whiteA(0.2),
                                        borderBottomWidth: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        flex: 1,
                                    }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            {editMode &&
                                                <>
                                                    {selected ?
                                                        <Image
                                                            style={{
                                                                height: 24, width: 24,
                                                            }}
                                                            resizeMode='contain'
                                                            source={imgAssets.checked}
                                                        />
                                                        :
                                                        <View
                                                            style={{
                                                                height: 24, width: 24,
                                                                borderWidth: 1,
                                                                borderColor: theme.whiteA(0.3),
                                                                borderRadius: 999
                                                            }}
                                                        />
                                                    }
                                                </>
                                            }

                                            <Text
                                                style={{
                                                    marginLeft: 10,
                                                    color: d.path ? theme.whiteA() : theme.whiteA(0.5)
                                                }}>
                                                {d.name + " " + d.ep}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            {

                                                d.path ?
                                                    <Image
                                                        style={{ height: 24, width: 24 }}
                                                        resizeMode='contain'
                                                        source={imgAssets.ok}
                                                    />
                                                    :

                                                    d.href === downloading ?
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={{ color: theme.primary }}>
                                                                {progress}
                                                            </Text>
                                                            <TouchableHighlight
                                                                onPress={() => {
                                                                    if (editMode) {
                                                                        return
                                                                    }
                                                                    pauseDownload()
                                                                }}
                                                            >
                                                                <Image
                                                                    style={{
                                                                        marginLeft: 10,
                                                                        width: 28,
                                                                        height: 28,
                                                                    }}
                                                                    resizeMode='contain'
                                                                    source={imgAssets.pause}
                                                                />
                                                            </TouchableHighlight>
                                                        </View>
                                                        :
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'flex-end',
                                                            alignItems: 'center'
                                                        }}>
                                                            <Text style={{ color: theme.whiteA(0.5) }}>
                                                                Download paused
                                                            </Text>
                                                            <TouchableHighlight
                                                                onPress={() => {
                                                                    if (editMode) {
                                                                        return
                                                                    }
                                                                    startDownload(d, true)
                                                                }}
                                                            >
                                                                <Image
                                                                    style={{
                                                                        marginLeft: 10,
                                                                        width: 28,
                                                                        height: 28,
                                                                    }}
                                                                    resizeMode='contain'
                                                                    source={imgAssets.downloadRound}
                                                                />
                                                            </TouchableHighlight>
                                                        </View>
                                            }
                                        </View>
                                    </View>
                                </TouchableHighlight>
                            )
                        }}
                    />
            }

            {
                editMode ?
                    <TouchableHighlight
                        onPress={() => {
                            if (!selectedCount) {
                                return
                            }

                            Alert.alert(
                                'Delete download?',
                                `${selectedCount} item(s) will be deleted.`
                                , [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'OK',
                                        onPress: async () => {
                                            setDeleting(true)
                                            await deleteDownload(selectedDelete)
                                            setDeleting(false)
                                            setEditMode(false)
                                        }
                                    },
                                ])

                        }}
                    >
                        <View style={{
                            marginTop: 'auto',
                            alignItems: 'center',
                            paddingVertical: 5,
                            backgroundColor: theme.whiteA(0.2)
                        }}>
                            <Image
                                style={{
                                    width: 28,
                                    height: 28,
                                }}
                                resizeMode='contain'
                                source={imgAssets.delete}
                            />
                            <Text
                                style={{ color: theme.whiteA() }}
                            >
                                Delete
                            </Text>
                        </View>
                    </TouchableHighlight>
                    :
                    <TouchableHighlight
                        style={{
                            backgroundColor: theme.whiteA(0.2),
                            padding: 10
                        }}
                        onPress={() => {
                            Alert.alert(
                                'Clear storage?',
                                `All item(s) will be deleted.`
                                , [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'OK',
                                        onPress: async () => {
                                            setDeleting(true)
                                            await clearStorage()
                                            setDeleting(false)
                                        }
                                    },
                                ])
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: theme.whiteA() }}>Storage Used:</Text>
                            <Text style={{ color: theme.whiteA() }}>{storage}</Text>
                        </View>
                    </TouchableHighlight>
            }
        </View >
    )
}