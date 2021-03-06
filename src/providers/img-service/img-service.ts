import { Injectable } from "@angular/core";
import {ActionSheetController, ToastController} from "ionic-angular";
//import { Camera, ImagePicker, Transfer } from "ionic-native";
//import { NoticeService } from "./notice.service";
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from "@ionic-native/image-picker";
import { TransferState} from "@angular/platform-browser";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import {BaseUI} from "../../common/baseUI";
import { File } from "@ionic-native/file";

@Injectable()
export class ImgServiceProvider extends BaseUI{

  // 参考：https://github.com/driftyco/ionic-native/blob/master/src/plugins/camera.ts
  // 调用相机时传入的参数
  private cameraOpt = {
    quality: 50,
    destinationType: 1, // Camera.DestinationType.FILE_URI,
    sourceType: 1, // Camera.PictureSourceType.CAMERA,
    encodingType: 0, // Camera.EncodingType.JPEG,
    mediaType: 0, // Camera.MediaType.PICTURE,
    allowEdit: true,
    correctOrientation: true
  };
  // 调用相册时传入的参数
  private imagePickerOpt = {
    maximumImagesCount: 1,//选择一张图片
    width: 800,
    height: 800,
    quality: 80
  };

  //imgPath: string = ''; //图片路径

  upload: any = {
    url: 'http://xxx/',           //接收图片的url
    fileKey: 'image',  //接收图片时的key
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' //不加入 发生错误！！
    },
    params: {},        //需要额外上传的参数
    success: (data) => {}, //图片上传成功后的回调
    error: (err) => {},   //图片上传失败后的回调
    listen: () => {}   //监听上传过程
  };

  constructor(private actionSheetCtrl: ActionSheetController,
              //private noticeSer: NoticeService,
              private camera:Camera,
              private imagePicker: ImagePicker,
              private  file: File,
              private transfer: FileTransfer,
              private fileTransfer:FileTransferObject,
              public toastCtrl: ToastController,
              ) {
    super();
    this.fileTransfer=this.transfer.create();

  }






  // 使用原生的ActionSheet组件
  /*private useNativeAS() {
    let buttonLabels = ['拍照', '从手机相册选择'];
    ActionSheet.show({
      'title': '选择',
      'buttonLabels': buttonLabels,
      'addCancelButtonWithLabel': 'Cancel',
      //'addDestructiveButtonWithLabel' : 'Delete'
    }).then((buttonIndex: number) => {
      if(buttonIndex == 1) {
        this.startCamera();
      } else if(buttonIndex == 2) {
        this.openImgPicker();
      }
    });
  }*/


  // 启动拍照功能
  private startCamera() {
    this.camera.getPicture(this.cameraOpt).then((imageData) => {

      this.uploadImg(imageData);

    }, (err) => {
      //this.noticeSer.showToast('ERROR:' + err); //错误：无法使用拍照功能！
    });
  }
  //
  // 打开手机相册
  openImgPicker() {
    let temp = '';
    this.imagePicker.getPictures(this.imagePickerOpt)
      .then((results) => {
        for (var i = 0; i < results.length; i++) {
          temp = results[i];
        }

        this.uploadImg(temp);

      }, (err) => {
        //this.noticeSer.showToast('ERROR:' + err); //错误：无法从手机相册中选择图片！
        let toast=this.showToast(this.toastCtrl,'ERROR:' + err)
        toast.dismissAll();
      });

    /*let str = '{"status":1,"msg":"提示：图片上传成功！","data":"http:\/\/192.168.1.20\/image\/580af6bcc4d40580af6bcc4d45.jpg"}';
    let res = JSON.parse(str);
    this.upload.success(res);*/
  }

  //
  //
  // 上传图片
  private uploadImg(path: string) {
    if(!path) {
      return;
    }

    let options: any;
    options = {
      fileKey: this.upload.fileKey,
      headers: this.upload.headers,
      params: this.upload.params
    };
    this.fileTransfer.upload(path, this.upload.url, options)
      .then((data) => {

        if(this.upload.success) {
          this.upload.success(JSON.parse(data.response));
        }

      }, (err) => {
        if(this.upload.error) {
          this.upload.error(err);
        } else {
          //this.noticeSer.showToast('错误：上传失败！');
          let toast=this.showToast(this.toastCtrl,'错误：上传失败！')
          toast.dismissAll();
        }
      });
  }

}

